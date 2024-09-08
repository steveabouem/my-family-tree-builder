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

  React.useEffect(() => {
    {Object.values(orderedData).map((member: any) => {
      populateTreeNode(member.id)
    })}

  }, [currentFamilyTree])

  const treeDetails = React.useMemo(() => {
    if (currentFamilyTree?.members) {
      // @ts-ignore
      return JSON.parse(currentFamilyTree?.members);
    }

    return null;
  }, [currentFamilyTree]);

  function generateNodeMarkup(anchor: any) {
    console.log('\n +++++++++++ANCHOR ID AND STEP +++++++++++ \n ', anchor?.id);
    const anchorElement =  React.createElement(
      'div',
      { id: `node-for-${anchor.id}` },
      anchor?.first_name || ''
    );
    return anchorElement
  }

  function populateTreeNode(nodeId: number) {
    const nodeMarkup = generateNodeMarkup(nodeId);
    const treeElement = document.getElementById('tree')!;
    treeElement?.appendChild();
    React.createElement
    // const nodeElement = document.getElementById(`node-for-${nodeId}`);
    // const node = data[nodeId];
    // let spouse: any = null;
    // let nodeChildren: any = null;
    // let nodeSiblings: any = null;

    // if (node?.spouses?.length) {
    //   spouse = data[node.spouses[0]];
    //   if (nodeElement) {
    //     const spouseNode = createElement('div', { className: 'test' }, spouse.first_name)
    //     // Array.from(nodeElement.childNodes).push(spouseNode)
    //     // @ts-ignore
    //     nodeElement.appendChild(spouseNode);
    //   }
    // }

    // if (node?.children?.length) {
    //   nodeChildren = node.children.reduce((children: any, currentChildId: any) => {

    //     return ([
    //       ...children, { ...data[currentChildId] }
    //     ])
    //   }, []);
    // }

    // if (node?.siblings?.length) {
    //   nodeSiblings = node.siblings.reduce((siblings: any, currentSiblingId: any) => {

    //     return ([
    //       ...siblings, { ...data[currentSiblingId] }
    //     ])
    //   }, []);
    // }
    return convertNodeToElement(treeElement)
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
      <div className="tree" id="tree">
       
      </div>
    </Page >
  );
}

export default ViewFamilyTree

const data: any = {
  "1": {
    "id": 1,
    "age": 30,
    "dob": "01/01/1994",
    "description": "Test 4th generation",
    "first_name": "SELF",
    "gender": 1,
    "email": "s4@b.com",
    "last_name": "Abwm 3",
    "marital_status": "Single",
    "children": [
      5,
      6
    ],
    "parents": [
      3
    ],
    "siblings": [
      4
    ],
  },
  "2": {
    "id": 2,
    "first_name": "MOTHER",
    "last_name": "Abanda",
    "dob": "1959/01/21",
    "profile_url": "https://randomuser.me/api/portraits/women/62.jpg",
    "age": 65,
    "gender": 2,
    "children": [
      1
    ],
    "spouses": [3],
    "siblings": [],
    "parents": []
  },
  "3": {
    "id": 3,
    "first_name": "FATHER",
    "last_name": "Abanda",
    "dob": "1955/01/21",
    "profile_url": "https://randomuser.me/api/portraits/men/91.jpg",
    "age": 69,
    "gender": 1,
    "children": [
      1
    ],
    "spouses": [
      2
    ],
    "siblings": [],
    "parents": []
  },
  "4": {
    "id": 4,
    "age": 27,
    "dob": "2017/01/21",
    "first_name": "SISTER",
    "gender": 2,
    "email": "clocl@.abd.cm",
    "last_name": "Abanda",
    "marital_status": "Single",
    "profile_url": "https://randomuser.me/api/portraits/women/69.jpg",
    "children": [
      7,
      8
    ],
    "parents": [
      2,
      3
    ],
    "siblings": [
      1
    ]
  },
  "5": {
    "id": 5,
    "age": 10,
    "dob": "2014/01/21",
    "first_name": "SON",
    "gender": 1,
    "email": "jj@.abd.cm",
    "last_name": "Abanda",
    "marital_status": "Single",
    "profile_url": "https://randomuser.me/api/portraits/lego/1.jpg",
    "parents": [
      1
    ],
    "siblings": [
      6
    ]
  },
  "6": {
    "id": 6,
    "age": 10,
    "dob": "2024/01/21",
    "first_name": "DAUGHTER",
    "gender": 2,
    "email": "dr@.abd.cm",
    "last_name": "Abanda",
    "marital_status": "Single",
    "profile_url": "https://randomuser.me/api/portraits/women/26.jpg",
    "parents": [
      1
    ],
    "siblings": [
      5
    ]
  },
  "7": {
    "id": 7,
    "age": 5,
    "dob": "2024/01/21",
    "first_name": "Grandchild one",
    "gender": 2,
    "email": "drj@.abd.cm",
    "last_name": "Abanda",
    "marital_status": "Single",
    "profile_url": "https://randomuser.me/api/portraits/women/9.jpg",
    "parents": [
      4
    ],
    "siblings": [
      8
    ]
  },
  "8": {
    "id": 8,
    "age": 1,
    "dob": "2024/01/21",
    "first_name": "Great grandchild one",
    "gender": 2,
    "email": "drj@.abd.cm",
    "last_name": "Abanda",
    "marital_status": "Single",
    "profile_url": "https://randomuser.me/api/portraits/women/68.jpg",
    "parents": [
      4
    ],
    "siblings": [
      7
    ]
  }
}

const orderedData = {
  "0": {
    "id": 3,
    "first_name": "FATHER",
    "last_name": "Abanda",
    "dob": "1955/01/21",
    "profile_url": "https://randomuser.me/api/portraits/men/91.jpg",
    "age": 69,
    "gender": 1,
    "children": [
      1
    ],
    "spouses": [
      2
    ],
    "siblings": [],
    "parents": []
  },
  "1": {
    "id": 2,
    "first_name": "MOTHER",
    "last_name": "Abanda",
    "dob": "1959/01/21",
    "profile_url": "https://randomuser.me/api/portraits/women/62.jpg",
    "age": 65,
    "gender": 2,
    "children": [
      1
    ],
    "spouses": [
      3
    ],
    "siblings": [],
    "parents": []
  },
  "2": {
    "id": 1,
    "age": 30,
    "dob": "01/01/1994",
    "description": "Test 4th generation",
    "first_name": "SELF",
    "gender": 1,
    "email": "s4@b.com",
    "last_name": "Abwm 3",
    "marital_status": "Single",
    "children": [
      5,
      6
    ],
    "parents": [
      3
    ],
    "siblings": [
      4
    ]
  },
  "3": {
    "id": 4,
    "age": 27,
    "dob": "2017/01/21",
    "first_name": "SISTER",
    "gender": 2,
    "email": "clocl@.abd.cm",
    "last_name": "Abanda",
    "marital_status": "Single",
    "profile_url": "https://randomuser.me/api/portraits/women/69.jpg",
    "children": [
      7,
      8
    ],
    "parents": [
      2,
      3
    ],
    "siblings": [
      1
    ]
  },
  "4": {
    "id": 5,
    "age": 10,
    "dob": "2014/01/21",
    "first_name": "SON",
    "gender": 1,
    "email": "jj@.abd.cm",
    "last_name": "Abanda",
    "marital_status": "Single",
    "profile_url": "https://randomuser.me/api/portraits/lego/1.jpg",
    "parents": [
      1
    ],
    "siblings": [
      6
    ]
  },
  "5": {
    "id": 6,
    "age": 10,
    "dob": "2024/01/21",
    "first_name": "DAUGHTER",
    "gender": 2,
    "email": "dr@.abd.cm",
    "last_name": "Abanda",
    "marital_status": "Single",
    "profile_url": "https://randomuser.me/api/portraits/women/26.jpg",
    "parents": [
      1
    ],
    "siblings": [
      5
    ]
  },
  "6": {
    "id": 7,
    "age": 5,
    "dob": "2024/01/21",
    "first_name": "Grandchild one",
    "gender": 2,
    "email": "drj@.abd.cm",
    "last_name": "Abanda",
    "marital_status": "Single",
    "profile_url": "https://randomuser.me/api/portraits/women/9.jpg",
    "parents": [
      4
    ],
    "siblings": [
      8
    ]
  },
  "7": {
    "id": 8,
    "age": 1,
    "dob": "2024/01/21",
    "first_name": "Great grandchild one",
    "gender": 2,
    "email": "drj@.abd.cm",
    "last_name": "Abanda",
    "marital_status": "Single",
    "profile_url": "https://randomuser.me/api/portraits/women/68.jpg",
    "parents": [
      4
    ],
    "siblings": [
      7
    ]
  }
}