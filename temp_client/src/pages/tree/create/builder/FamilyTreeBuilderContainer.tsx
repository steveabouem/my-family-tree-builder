import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Box, FormControlLabel, Grid2, Radio, RadioGroup, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { ExpandableNodeData, FamilyMemberDAOV2, FamilyTreeDAOV2, FlowComponentTypes, KinshipType, MemberVisibility } from 'types';
import GlobalContext from 'contexts/creators/global';
import { addEdge, Node, useEdgesState, useNodesState } from '@xyflow/react';
import { useNavigate } from 'react-router';
import GenealogyTree from 'pages/tree/layout/GenealogyTree';
import { useCreateFamilyTree } from 'api';
import PageUrls from 'utils/urls';
import MemberSidebar from './MemberSidebar';
import BoxRow from 'components/common/containers/column';
import { useFormikContext } from 'formik';
import { v4 } from 'uuid';
import { FaBackwardStep } from 'react-icons/fa6';
import { siblingGap } from 'pages/constants';


export const FamilyTreeBuilderContainer: React.FC = () => {
  const [isTreeExpanded, setIsTreeExpanded] = useState(false);
  const { updateModal, clearModal } = useContext(GlobalContext);
  const { mutate: createFamilyTreeMutation, error, isPending } = useCreateFamilyTree();
  const { values, setFieldValue, setValues } = useFormikContext<FamilyTreeDAOV2>();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ExpandableNodeData, FlowComponentTypes.expandableNode>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const requiredFields: (keyof FamilyMemberDAOV2)[] = ['visibility', 'first_name', 'last_name', 'node_id', 'deceased', 'gender'];
  const latestValuesRef: any = useRef({});

  useEffect(() => {
    generateInitialNode();
  }, []);

  // keep an always fresh values reference This is necessary for the modal's addRElative,
  // since the attached closure never captures the latest values available,
  // but rather the ones set on the initial node creation, i.e empty
  useEffect(() => {
    latestValuesRef.current = values || {};
    // @ts-ignore
  }, [values]);

  useEffect(() => {
    console.log({nodes});
  }, [nodes]);

  // const onConnect = useCallback(
  //   (params: any) => setEdges((els: any) => addEdge(params, els)),
  //   [],
  // );

  function getMissingFields(): { valid: boolean; missing: string } {
    let allValid = true;
    let missing = '';

    requiredFields.forEach((key: keyof FamilyMemberDAOV2) => {
      if (!latestValuesRef?.current?.current?.[key]) {
        allValid = false;
        missing += `, ${key}`;
      }
    });

    return ({ missing, valid: allValid });
  }

  function showRelativeModal(relation: KinshipType, meta?: string) {
    const currentVals = getMissingFields();

    if (currentVals.valid) {
      updateModal({
        onConfirm: () => addMember(relation, meta),
        buttons: { cancel: true, confirm: true },
        title: <Trans>add_relative</Trans>,
        content: <Box>
          {relation}
        </Box>,
        hidden: false
      });
    } else {
      clearModal();
      updateModal({
        buttons: { cancel: true, confirm: false, cancelText: <Trans>close</Trans> },
        title: <Trans>add_relative</Trans>,
        content: <Trans>missing fields: {currentVals.missing}</Trans>,
        hidden: false
      });
    }
  }

  function generateInitialNode(sourceNodeid?: string): void {
    const initialNode: any = {
      id: sourceNodeid || v4(),
      type: FlowComponentTypes.expandableNode,
      data: {
        member: {},
        selected: false,
        addRelative: (k: KinshipType, meta?: string) => { showRelativeModal(k, meta) },
        onClick: () => ({}),
      },
      position: { x: 0, y: 0 },
    };

    setNodes([{ ...initialNode }]);
  }

  /**
   * ## Adds a relative node both on screen and in the form values
   * - Generates a node id for the relative to be filled 
   * - Determine the inverse relation
   * - Add the new id to the current membr's values (the contents of the form on screen) based on that inverse rltion
   * - Lookup other existing members in values that would share the same relation (the one in the params) (exp father means you need to lookup currnt mmbr's siblings)
   * - Resets the 'current' member object from the form
   * - copies it to the relevant kinship array in the members copy of the previous current values.
   * *Note:* 
   * #
   * By the time this function is invoked, the values in current will have been saved, meaning they will
  * have a copy in the members object. 
  * */
  function addMember(relation: KinshipType, meta?: string) {
    const incomingMember = latestValuesRef.current?.current;
    const existingMembers = latestValuesRef.current?.members || {};
    const currentMemberNodeId = incomingMember?.node_id || '';
    const newNodeId = v4();
    const currentNodes: any = [];
    let inverseRelation;

    if (!!incomingMember) {
      const newMemberRelationshipArray = [incomingMember.node_id];

      switch (relation) {
        case KinshipType.sibling:
          // if there are already members in the family tree
          for (const m in existingMembers) {
            // verify if any of the existing members are siblings to the incoming one
            const currentExistingMembersSiblings = existingMembers?.[m]?.siblings || [];
            const existingHasIncomingAsSibling = currentExistingMembersSiblings.find(
              (info: { node_id: string, shared_parent: string }) => info.node_id === currentMemberNodeId);
            const incomingHasExistingAsSibling = incomingMember?.siblings?.includes(m);
            // if they are, update each of their respective siblings array
            if (existingHasIncomingAsSibling || incomingHasExistingAsSibling) {
              newMemberRelationshipArray.push(existingMembers[m].node_id);
              setFieldValue(`members[m].siblings`, [...existingMembers[m].siblings, { node_id: newNodeId }]);
            }
          }

          // set the current member values to allow adding a new  person
          inverseRelation = KinshipType.sibling;
          //! THIS IS INCORRECT. I SEE WHAT YOURE TRYING TO DO BUT YOURE USING THE SAME VARIABLE
          incomingMember.siblings = [...incomingMember?.siblings || [], { node_id: newNodeId }];
          break;
        case KinshipType.parent:
          inverseRelation = KinshipType.child;
          incomingMember.parents = [...incomingMember?.parents || [], newNodeId];
          break;
        case KinshipType.spouse:
          inverseRelation = KinshipType.spouse;
          incomingMember.spouses = [...incomingMember?.spouses || [], newNodeId];
          break;
        case KinshipType.child:
          inverseRelation = KinshipType.parent;
          incomingMember.children = [...incomingMember?.children || [], newNodeId];
          break;
      };

      // copy current member in the list, and clear form to allow for incoming relative's info, 
      // and keep the list of the node_ids for all the previous members sharing a relevant relation with the current in form
      setValues({
        // @ts-ignore: TODO - type current properly to account for scenario below
        ...values, current: { node_id: newNodeId, [inverseRelation]: [...newMemberRelationshipArray, currentMemberNodeId] }, members: {
          ...values.members, [currentMemberNodeId]: { ...incomingMember }
        }
      });
      // build a node object for each member. By this point of the function, the relation between the incoming member and every of the others will have already been updated
      const newNodesToAdd = Object.values(latestValuesRef.current?.members || {}).map(m => buildNodeFromMemberValues(m));
      const incomingMemberNode = buildNodeFromMemberValues(incomingMember);
      // BEFORE LINE BELOW, THE POSITION, AND REMAINING NODES  PROPS NEED TO BE ADDED TO THE SIMPLE OBJECT ADDED TO MEMBERS.
      //  sEE HOW PREVIOUS TREE COMPONEND TRAVERSED, AND APPLY IT HERE
      // IT SHOULD POPULATE THE TREE WITH THE ADDITIONAL NODES
// @ts-ignore
      setNodes([...newNodesToAdd, incomingMemberNode]);
    }
  }

  function buildNodeFromMemberValues(member: any) {
    // build the node data for the incoming member
    return {
      id: member.node_id,
      type: FlowComponentTypes.expandableNode,
      data: {
        member,
        selected: false,
        addRelative: (k: KinshipType, meta?: string) => { showRelativeModal(k, meta) },
        onClick: () => ({}),
      },
      position: { x: 0, y: 0 },
    };

  }

  function grabProfilePictureFile(f: any) {
    console.log('file', f);

  }

  return (
    <Box sx={mainContainerStyle}>
      <Typography variant='body1'><Trans>graph_mode_tree_intro</Trans></Typography>
      <BoxRow sx={{ justifyContent: 'start' }}>
        <RadioGroup
          aria-labelledby="expand-tree-options-group"
          name="radio-buttons-group"
          value={isTreeExpanded}
          sx={{ display: 'flex', gap: 2, justifyContent: 'start', flexDirection: 'row', width: '30%' }}
        >
          <FormControlLabel
            value={false} control={<Radio size='small' onClick={() => setIsTreeExpanded(false)} />}
            label={
              <Typography variant='body1'
                fontWeight="bold">
                <Trans>expand_sidebar</Trans>
              </Typography>
            }
          />
          <FormControlLabel
            value={true} control={<Radio size='small' onClick={() => setIsTreeExpanded(true)} />}
            label={
              <Typography variant='body1'
                fontWeight="bold">
                <Trans>expand_tree</Trans>
              </Typography>
            }
          />
        </RadioGroup>
      </BoxRow>
      <Grid2 container display="flex" sx={{ height: '80vh' }}>
        <Grid2 size={isTreeExpanded ? 1 : 4} display="flex" justifyContent="start" gap={2} flexDirection="column" sx={{ overflow: 'hidden' }}>
          <MemberSidebar />
        </Grid2>
        <Grid2 size={isTreeExpanded ? 11 : 8}>
          <GenealogyTree nodes={nodes} edges={edges} handleNodesChange={onEdgesChange} handleEdgesChange={onNodesChange} />
        </Grid2>
      </Grid2>
    </Box>
  );
};

const mainContainerStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  position: 'relative'
};