import React from "react";
import ReactFamilyTree from 'react-family-tree';
import { ExtNode, Gender, RelType } from "relatives-tree/lib/types";
import { Trans } from "@lingui/macro";
import { useNavigate, useParams } from "react-router-dom";
import Page from "../common/Page";
import FamilyTreeContext from "../../context/creators/familyTree.context";
import { service } from "../../services";
import GlobalContext from "../../context/creators/global.context";
import { DTreeNode } from "./definitions";
import TreeNodeBubble from "../family/TreeNodeBubble";
import('./chatGPT.tree.scss')

const ViewFamilyTree = () => {
  const { currentFamilyTree, updateCurrentFamilyTree } = React.useContext(FamilyTreeContext);
  const { toggleLoading, updateModal } = React.useContext(GlobalContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const getCurrentTree = async (): Promise<any> => {
    const familyTreeService = new service.familyTree();

    if (id) {
      const tree = await familyTreeService.getOne(id)
        .catch(e => {
          console.log('Get FAMILY: ', e);
        });

      return tree;
    } else {
      navigate('/connect');
    }
  };

  const treeDetails = React.useMemo(() => {
    if (currentFamilyTree?.members) {
      // @ts-ignore
      return JSON.parse(currentFamilyTree?.members);
    }

    return null;
  }, [currentFamilyTree]);

  function createTreeNode(anchor: any) {
    if (anchor) {
      const anchorSpouse = treeDetails[anchor.spouses[0]];
      const anchorChildren = anchor?.children?.reduce((children: any, currentChild: any) => ([
        ...children, treeDetails[currentChild]
      ]), []);

      return (
        <div className="d-flex align-items-center flex-column text-center household">
          {anchor ? (
            <>
              <div className="d-flex justify-content-between nodes-row parents">
                <TreeNodeBubble node={anchor} onClick={() => {}} onHover={() => {}} /> 
                <TreeNodeBubble node={anchorSpouse} onClick={() => {}} onHover={() => {}} /> 
              </div>
              divider
            </>
          ) : ''}
          {anchorChildren?.length ? (
            <div className="nodes-row children d-flex justify-content-between children">
              <div className="d-flex justify-content-between member-children">
                {anchorChildren?.map((child: any) => (
                  <div>
                    {createTreeNode(child)}
                  </div>
                ))}
              </div>
            </div>
          ) : ''}
        </div>
      );
    }
  }

  function buildFamilyTree() {
    if (treeDetails) {
      const orderedTreeMembers: any = [];
      // get oldest family member te determine tree root 
      const orderedIds = Object.keys(treeDetails).sort((a: any, b: any) => {
        if (treeDetails[a]?.age > treeDetails[b]?.age) {
          return -1;
        }

        return 1;
      });

      orderedIds.forEach((id: any) => {
        // @ts-ignore
        orderedTreeMembers.push(treeDetails[id]);
      });

      const anchor = treeDetails[orderedIds[0]];
      const rootLi = createTreeNode(anchor);

      return rootLi;
    }
  }

  React.useEffect(() => {
    getCurrentTree()
      .then(({ data }) => {
        if (!data.error) {
          if (updateCurrentFamilyTree) updateCurrentFamilyTree(data.payload);
          if (toggleLoading) toggleLoading(false);
        }
      })
      .catch(e => {
        if (updateModal) updateModal({
          hidden: false,
          buttons: { confirm: true, cancel: false },
          content: <Trans>error_modal_message</Trans>,
          title: <Trans>error_modal_title</Trans>,
        });
        if (toggleLoading) toggleLoading(false);
      });
  }, []);


  return (
    <Page subtitle="" title={`${currentFamilyTree?.name || ''}`}>
      <div className="tree">
        <ul>
          {buildFamilyTree()}
        </ul>
      </div>
    </Page >
  );
}

export default ViewFamilyTree 