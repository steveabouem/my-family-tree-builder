import React, { createElement } from "react";
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
import('./tree.scss');

const ViewFamilyTree = () => {
  const [rootId, setRootId] = React.useState<any>();
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


  React.useEffect(() => {
    setRootId(data[0].id);
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

      <ReactFamilyTree
        nodes={[...data]}
        rootId={'1'}
        width={50}
        height={60}
        renderNode={(node: any) => (
          <TreeNodeBubble
            // @ts-ignore
            node={node}
          />
        )}
      />
    </Page >
  );
}

export default ViewFamilyTree

const data: any = [
  {
    "id": "H-06WvsfJ",
    "gender": "female",
    "parents": [
      {
        "id": "1",
      },{
        "id": "2",
      }
    ],
    "children": [],
    "siblings": [
     
    ],
    "spouses": [],
    "name": "random NAme 24"
  },
  {
    "id": '1',
    "age": 30,
    "dob": "01/01/1994",
    "description": "Test 4th generation",
    "first_name": "Steve 3",
    "gender": 1,
    "parent_1": null,
    "parent_2": null,
    "email": "s4@b.com",
    "last_name": "Abwm 3",
    "imm_family": null,
    "marital_status": "Single",
    "occupation": null,
    "partner": null,
    "profile_url": null,
    "user_id": 1,
    "created_by": 1,
    "siblings": [],
    "parents": [],
    "spouses": [{id: '2'}],
    "children": [{id: 'H-06WvsfJ'}],
  },
  {
    "id": '2',
    "first_name": "My Mom",
    "last_name": "Abanda",
    "dob": "1959/01/21",
    "profile_url": "https://randomuser.me/api/portraits/men/0.jpg",
    "age": 65,
    "gender": 2,
    "children": [
      {id: 'H-06WvsfJ'}
    ],
    "spouses": [
      {id: '1'}
    ],
    "siblings": [],
    "parents": []
  }
]