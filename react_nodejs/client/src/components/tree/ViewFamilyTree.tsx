import React from "react";
import ReactFamilyTree from 'react-family-tree';
import { ExtNode, Gender, RelType } from "relatives-tree/lib/types";
import { Trans } from "@lingui/macro";
import { useNavigate, useParams } from "react-router-dom";
import Page from "../common/Page";
import FamilyTreeContext from "../../context/creators/familyTree.context";
import { service } from "../../services";
import GlobalContext from "../../context/creators/global.context";
import FamilyNode from "../FamilyNode";
import { NODE_HEIGHT, NODE_WIDTH } from "./const";
import { DTreeNode } from "./definitions";
import { table } from "console";
import('../../styles/index.scss');

const ViewFamilyTree = () => {
  const [membersDetails, setMembersDetails] = React.useState({});
  const { currentFamilyTree, updateCurrentFamilyTree } = React.useContext(FamilyTreeContext);
  const { toggleLoading, updateModal } = React.useContext(GlobalContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const getTreeMembers = async (id: number) => {
    const familyTreeService = new service.familyTree();
    const treeMembers = await familyTreeService.getMembers(id);

    return treeMembers;
  }

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
    // @ts-ignore
    if (membersDetails?.id) {
      console.log({ sample, membersDetails });

      return (
        <ReactFamilyTree
          // @ts-ignore
          nodes={sampleFromDb}
          // @ts-ignore
          rootId={sampleFromDb[0]?.id}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          className="tree"
          renderNode={(node: Readonly<ExtNode>) => (
            <FamilyNode
              key={node.id}
              node={node}
              isRoot={false}
              isHover={false}
              onClick={() => { }}
              onSubClick={() => { }}
              style={{
                transform: `translate(${node.left * (NODE_WIDTH / 2)}px, ${node.top * (NODE_HEIGHT / 2)}px)`,
              }}
            />
          )}
        />
      )
    } else {
      return <></>
    }

  }, [membersDetails])

  React.useEffect(() => {
    if (currentFamilyTree) {
      return
    }

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
  }, [currentFamilyTree]);

  React.useEffect(() => {
    //! TODO: you will need a new migration to either:
    //! - keep your current data structuredClone, but save the family tree and the RFT blueprint in a separate table, to then call for its contents here
    //! - Do a new migration to refactore the family tree table and match it exactly to RFT
    // if (id) {
    //   getTreeMembers(Number(id))
    //     .then(({ data }: any) => {
    //       setMembersDetails(data?.payload);
    //     })
    //     .catch((e: unknown) => {
    //       console.log('Unable to get the family members', e);
    //     })
    // }
  }, [currentFamilyTree, id]);

  return (
    <Page subtitle="" title={`${currentFamilyTree?.name || ''}`}>
      <ReactFamilyTree
        // @ts-ignore
        nodes={sampleFromDb}
        // @ts-ignore
        rootId={sampleFromDb[0]?.id}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        className="tree"
        renderNode={(node: Readonly<ExtNode>) => (
          <FamilyNode
            key={node.id}
            node={node}
            isRoot={false}
            isHover={false}
            onClick={() => { }}
            onSubClick={() => { }}
            style={{
              transform: `translate(${node.left * (NODE_WIDTH / 2)}px, ${node.top * (NODE_HEIGHT / 2)}px)`,
            }}
          />
        )}
      />
    </Page >
  );
}

const sampleFromDb = [
  {
      "id": "1",
      "age": null,
      "dob": "1985/01/21",
      "description": "Test mapping with RFT",
      "first_name": "User 1",
      "gender": 1,
      "parent_1": null,
      "parent_2": 2,
      "email": "s1@b.com",
      "last_name": "Abm 1",
      "imm_family": null,
      "marital_status": "Single",
      "occupation": null,
      "partner": null,
      "profile_url": null,
      "siblings": [],
      "parents": [
          {
              "id": "2",
              "type": "blood"
          },
          {
              "id": "3",
              "type": "blood"
          }
      ],
      "spouses": [],
      "children": [
          {
              "id": "5",
              "dob": "2024/01/21",
              "first_name": "JJ",
              "gender": 2,
              "email": "jj@.abd.cm",
              "last_name": "Abanda",
              "marital_status": "Single",
              "type": "blood"
          }
      ]
  },
  {
      "id": "2",
      "first_name": "Aline",
      "last_name": "Abanda",
      "dob": "1959/01/21",
      "profile_url": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/91/91d963f85581bc0a73e02432085dae7546426e42.jpg",
      "gender": 2,
      "children": [
          {
              "id": "1",
              "type": "blood"
          }
      ],
      "spouses": [
          {
              "id": "3",
              "type": "married"
          }
      ],
      "siblings": [],
      "parents": []
  },
  {
      "id": "3",
      "first_name": "Abanda",
      "last_name": "Abanda",
      "dob": "1955/01/21",
      "profile_url": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/5c/5c2d7e9dfd804434534b6290e9a176bf0cf417aa.jpg",
      "gender": 1,
      "children": [
          {
              "id": "1",
              "type": "blood"
          }
      ],
      "spouses": [
          {
              "id": "2",
              "type": "married"
          }
      ],
      "siblings": [],
      "parents": []
  },
  {
      "id": "4",
      "dob": "2017/01/21",
      "first_name": "Clotilde",
      "gender": 2,
      "email": "clocl@.abd.cm",
      "last_name": "Abanda",
      "marital_status": "Single",
      "siblings": [
          {
              "id": "1",
              "type": "blood"
          }
      ],
      "parents": [
          {
              "id": "1",
              "type": "blood"
          }
      ],
      "spouses": [],
      "children": []
  },
  {
      "id": "5",
      "dob": "2024/01/21",
      "first_name": "JJ",
      "gender": 2,
      "email": "jj@.abd.cm",
      "last_name": "Abanda",
      "marital_status": "Single",
      "children": [],
      "parents": [
          {
              "id": "1",
              "type": "blood"
          }
      ],
      "siblings": [
          {
              "id": "1",
              "type": "blood"
          }
      ],
      "spouses": []
  }
]
const sample = [

  {
    id: "HkqEDLvxE",
    gender: "male",
    firstName: 'john',
    parents: [
      {
        id: "011jVS4rb",
        type: "blood"
      },
      {
        id: "PXACjDxmR",
        type: "blood"
      }
    ],
    siblings: [
      {
        id: "kuVISwh7w",
        type: "blood"
      },
      {
        id: "UIEjvLJMd",
        type: "blood"
      },
      {
        id: "ZVi8fWDBx",
        type: "blood"
      }
    ],
    "spouses": [],
    "children": []
  },
  {
    id: "011jVS4rb",
    gender: "male",
    parents: [
      {
        id: "ypu71w9_Q",
        type: "blood"
      },
      {
        id: "GEf8zF7A4",
        type: "blood"
      }
    ],
    "children": [
      {
        id: "HkqEDLvxE",
        type: "blood"
      },
      {
        id: "kuVISwh7w",
        type: "blood"
      },
      {
        id: "UIEjvLJMd",
        type: "blood"
      },
      {
        id: "ZVi8fWDBx",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "PXACjDxmR",
        type: "married"
      }
    ]
  },
  {
    id: "PXACjDxmR",
    gender: "female",
    parents: [
      {
        id: "2DlrR0fK8",
        type: "blood"
      }
    ],
    "children": [
      {
        id: "HkqEDLvxE",
        type: "blood"
      },
      {
        id: "kuVISwh7w",
        type: "blood"
      },
      {
        id: "UIEjvLJMd",
        type: "blood"
      },
      {
        id: "ZVi8fWDBx",
        type: "blood"
      }
    ],
    siblings: [
      {
        id: "H-06WvsfJ",
        type: "blood"
      }
    ],
    "spouses": [
      {
        id: "011jVS4rb",
        type: "married"
      }
    ]
  },
  {
    id: "kuVISwh7w",
    gender: "male",
    parents: [
      {
        id: "011jVS4rb",
        type: "blood"
      },
      {
        id: "PXACjDxmR",
        type: "blood"
      }
    ],
    "children": [
      {
        id: "Fbc9iwnJl",
        type: "blood"
      }
    ],
    siblings: [
      {
        id: "HkqEDLvxE",
        type: "blood"
      },
      {
        id: "UIEjvLJMd",
        type: "blood"
      },
      {
        id: "ZVi8fWDBx",
        type: "blood"
      }
    ],
    "spouses": [
      {
        id: "vRSjcaDGj",
        type: "married"
      }
    ]
  },
  {
    id: "UIEjvLJMd",
    gender: "female",
    parents: [
      {
        id: "011jVS4rb",
        type: "blood"
      },
      {
        id: "PXACjDxmR",
        type: "blood"
      }
    ],
    "children": [
      {
        id: "6_OTJvbvS",
        type: "blood"
      },
      {
        id: "JhSCcdFEP",
        type: "blood"
      },
      {
        id: "6hNxNY1-I",
        type: "blood"
      }
    ],
    siblings: [
      {
        id: "HkqEDLvxE",
        type: "blood"
      },
      {
        id: "kuVISwh7w",
        type: "blood"
      },
      {
        id: "ZVi8fWDBx",
        type: "blood"
      }
    ],
    "spouses": [
      {
        id: "RZbkr5vAi",
        type: "married"
      }
    ]
  },
  {
    id: "RZbkr5vAi",
    gender: "male",
    parents: [],
    "children": [
      {
        id: "6_OTJvbvS",
        type: "blood"
      },
      {
        id: "JhSCcdFEP",
        type: "blood"
      },
      {
        id: "6hNxNY1-I",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "UIEjvLJMd",
        type: "married"
      }
    ]
  },
  {
    id: "vRSjcaDGj",
    gender: "female",
    parents: [
      {
        id: "6vASIIxhd",
        type: "blood"
      },
      {
        id: "iFiwqrWx-",
        type: "blood"
      }
    ],
    "children": [
      {
        id: "Fbc9iwnJl",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "kuVISwh7w",
        type: "married"
      }
    ]
  },
  {
    id: "Fbc9iwnJl",
    gender: "female",
    parents: [
      {
        id: "kuVISwh7w",
        type: "blood"
      },
      {
        id: "vRSjcaDGj",
        type: "blood"
      }
    ],
    "children": [],
    siblings: [],
    "spouses": []
  },
  {
    id: "ypu71w9_Q",
    gender: "male",
    parents: [
      {
        id: "TsyAkbF89",
        type: "blood"
      },
      {
        id: "T54Km7uOC",
        type: "blood"
      }
    ],
    "children": [
      {
        id: "011jVS4rb",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "GEf8zF7A4",
        type: "married"
      }
    ]
  },
  {
    id: "GEf8zF7A4",
    gender: "female",
    parents: [
      {
        id: "gsgwGS_Kw",
        type: "blood"
      },
      {
        id: "ZgTZx9uXQ",
        type: "blood"
      }
    ],
    "children": [
      {
        id: "011jVS4rb",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "ypu71w9_Q",
        type: "married"
      }
    ]
  },
  {
    id: "2DlrR0fK8",
    gender: "male",
    parents: [],
    "children": [
      {
        id: "PXACjDxmR",
        type: "blood"
      },
      {
        id: "H-06WvsfJ",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": []
  },
  {
    id: "gsgwGS_Kw",
    gender: "male",
    parents: [],
    "children": [
      {
        id: "GEf8zF7A4",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "ZgTZx9uXQ",
        type: "married"
      }
    ]
  },
  {
    id: "ZgTZx9uXQ",
    gender: "female",
    parents: [],
    "children": [
      {
        id: "GEf8zF7A4",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "gsgwGS_Kw",
        type: "married"
      }
    ]
  },
  {
    id: "ZVi8fWDBx",
    gender: "male",
    parents: [
      {
        id: "011jVS4rb",
        type: "blood"
      },
      {
        id: "PXACjDxmR",
        type: "blood"
      }
    ],
    "children": [],
    siblings: [
      {
        id: "HkqEDLvxE",
        type: "blood"
      },
      {
        id: "kuVISwh7w",
        type: "blood"
      },
      {
        id: "UIEjvLJMd",
        type: "blood"
      }
    ],
    "spouses": [
      {
        id: "wJ1EBvc5m",
        type: "married"
      }
    ]
  },
  {
    id: "6_OTJvbvS",
    gender: "male",
    parents: [
      {
        id: "RZbkr5vAi",
        type: "blood"
      },
      {
        id: "UIEjvLJMd",
        type: "blood"
      }
    ],
    "children": [],
    siblings: [
      {
        id: "JhSCcdFEP",
        type: "blood"
      },
      {
        id: "6hNxNY1-I",
        type: "blood"
      }
    ],
    "spouses": []
  },
  {
    id: "JhSCcdFEP",
    gender: "female",
    parents: [
      {
        id: "RZbkr5vAi",
        type: "blood"
      },
      {
        id: "UIEjvLJMd",
        type: "blood"
      }
    ],
    "children": [
      {
        id: "Z0QA5oKks",
        type: "blood"
      }
    ],
    siblings: [
      {
        id: "6_OTJvbvS",
        type: "blood"
      },
      {
        id: "6hNxNY1-I",
        type: "blood"
      }
    ],
    "spouses": [
      {
        id: "ilad8NH6g",
        type: "married"
      }
    ]
  },
  {
    id: "6hNxNY1-I",
    gender: "male",
    parents: [
      {
        id: "RZbkr5vAi",
        type: "blood"
      },
      {
        id: "UIEjvLJMd",
        type: "blood"
      }
    ],
    "children": [],
    siblings: [
      {
        id: "6_OTJvbvS",
        type: "blood"
      },
      {
        id: "JhSCcdFEP",
        type: "blood"
      }
    ],
    "spouses": []
  },
  {
    id: "ilad8NH6g",
    gender: "male",
    parents: [],
    "children": [
      {
        id: "Z0QA5oKks",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "JhSCcdFEP",
        type: "married"
      }
    ]
  },
  {
    id: "Z0QA5oKks",
    gender: "male",
    parents: [
      {
        id: "ilad8NH6g",
        type: "blood"
      },
      {
        id: "JhSCcdFEP",
        type: "blood"
      }
    ],
    "children": [],
    siblings: [],
    "spouses": []
  },
  {
    id: "wJ1EBvc5m",
    gender: "female",
    parents: [],
    "children": [],
    siblings: [],
    "spouses": [
      {
        id: "ZVi8fWDBx",
        type: "married"
      }
    ]
  },
  {
    id: "TsyAkbF89",
    gender: "male",
    parents: [],
    "children": [
      {
        id: "ypu71w9_Q",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "T54Km7uOC",
        type: "married"
      }
    ]
  },
  {
    id: "T54Km7uOC",
    gender: "female",
    parents: [],
    "children": [
      {
        id: "ypu71w9_Q",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "TsyAkbF89",
        type: "married"
      }
    ]
  },
  {
    id: "6vASIIxhd",
    gender: "male",
    parents: [],
    "children": [
      {
        id: "vRSjcaDGj",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "iFiwqrWx-",
        type: "married"
      }
    ]
  },
  {
    id: "iFiwqrWx-",
    gender: "female",
    parents: [],
    "children": [
      {
        id: "vRSjcaDGj",
        type: "blood"
      }
    ],
    siblings: [],
    "spouses": [
      {
        id: "6vASIIxhd",
        type: "married"
      }
    ]
  },
  {
    id: "H-06WvsfJ",
    gender: "female",
    parents: [
      {
        id: "2DlrR0fK8",
        type: "blood"
      }
    ],
    "children": [],
    siblings: [
      {
        id: "PXACjDxmR",
        type: "blood"
      }
    ],
    "spouses": []
  }

]

export default ViewFamilyTree 