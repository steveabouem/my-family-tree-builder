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
import('../../styles/tree.styles.scss');
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
    console.log({member});
    
    return (
      <div className="d-flex align-items-center flex-column single-unit text-center">

        {member?.parents?.length ? (
          <>
            <div className="d-flex justify-content-between member-parents">
              {member?.parents?.map((p: any) => (
                <div className="text-danger">
                  {createTreeNode(p)}
                </div>
              ))}
            </div>
            |||
          </>
        ) : ''}
        <div className="member-siblings d-flex justify-content-between">
          <div className="current-member-root">
            <div className="d-flex flex-column align-items-center">
              {member?.first_name}
              <div className="d-flex justify-content-between member-children">
                {member?.children?.map((child: any) => (
                  <div>{createTreeNode(child)}</div>
                ))}
              </div>
            </div>
          </div>
          {member?.siblings?.map((sibling: any) => (
            <div>{createTreeNode(sibling)}</div>
          ))}
        </div>
      </div>
    );
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
      {/* <ReactFamilyTree
          // @ts-ignore
          nodes={treeDetails}
          // @ts-ignore
          rootId={treeDetails[0]?.id}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          className="tree"
          renderNode={(node: Readonly<ExtNode>) => (
            <FamilyNode
              key={node.id}
              node={node}
              isRoot={node.id === treeDetails[0]?.id}
              isHover={false}
              onC55ick={() => { }}
              onSubClick={() => { }}
              style={{
                transform: `translate(${node.left == 0 ? '25' : node.left * (NODE_WIDTH / 1.7)}px, ${node.top == 0 ? '25' : node.top * (NODE_HEIGHT / 1.9)}px)`,
              }}
            />
          )}
        /> */}
      <div className="tree">
        <ul>
          {buildFamilyTree()}
        </ul>
      </div>
    </Page >
  );
}

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
        type: "adopted"
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