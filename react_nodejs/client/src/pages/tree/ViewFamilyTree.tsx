import React from "react";
import ReactFamilyTree from 'react-family-tree';
import { ExtNode, Gender, RelType } from "relatives-tree/lib/types";
import { Trans } from "@lingui/macro";
import { useNavigate, useParams } from "react-router-dom";
import Page from "../common/Page";
import FamilyTreeContext from "../../context/creators/familyTree.context";
import { service } from "../../services";
import GlobalContext from "../../context/creators/global.context";
import { NODE_HEIGHT, NODE_WIDTH } from "./const";
import { DTreeNode } from "./definitions";
import('../../assets/styles/tree.styles.scss');
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
      return JSON.parse(currentFamilyTree?.members || '[]');
    }

    return null;
  }, [currentFamilyTree]);

  function createTreeNode(member: any) {
    if (treeDetails) {
      return (
        <div className="d-flex align-items-center flex-column single-unit text-center">
          {member?.parents?.length ? (
            <>
              <div className="d-flex justify-content-between member-parents">
                {member?.parents?.map((p: any) => {
                  console.log('CURRENT PARENT: ', p);
                  
                  const parentNode = treeDetails.find((n: any) => n.id === 2);
                  console.log('FOUND PARENT? ', parentNode, treeDetails);
                  

                  if (parentNode) {
                    return (
                      <div className="text-danger">
                        {createTreeNode(p)}
                      </div>
                    );
                  }
                })}
              </div>
              |||
            </>
          ) : ''}
          <div className="member-siblings d-flex justify-content-between">
            <div className="current-member-root">
              <div className="d-flex flex-column align-items-center">
                {member?.first_name}
                <div className="d-flex justify-content-between member-children">
                  {member?.children?.map((child: any) => {
                    const childNode = treeDetails.find((n: any) => n.id === child.id);

                    if (childNode) {
                      return (
                        <div>
                          {createTreeNode(child)}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
            {member?.siblings?.map((sibling: any) => {
              const siblingNode = treeDetails.find((n: any) => n.id === sibling.id);

              if (siblingNode) {
                return (
                  <div className="text-danger">
                    {createTreeNode(sibling)}
                  </div>
                );
              }
            })}
          </div>
        </div>
      );
    }

    return '';
  }

  function buildFamilyTree() {
    if (treeDetails) {
      const rootMember = treeDetails[0];
      const rootLi = createTreeNode(rootMember);

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