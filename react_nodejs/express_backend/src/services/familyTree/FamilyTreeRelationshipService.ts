import FamilyTree from "../../models/FamilyTree";
import FamilyMember from "../../models/FamilyMember";
import logger from "../../utils/logger";

export class FamilyTreeRelationshipService {
  
  /**
   * Get a family tree with all its members
   */
  async getTreeWithMembers(treeId: number): Promise<FamilyTree | null> {
    try {
      const tree = await FamilyTree.findByPk(treeId, {
        include: [{
          model: FamilyMember,
          as: 'FamilyMembers',
          attributes: ['id', 'first_name', 'last_name', 'email', 'gender', 'dob', 'age', 'occupation', 'marital_status']
        }]
      });
      
      return tree;
    } catch (error) {
      logger.error('Error fetching tree with members:', error);
      return null;
    }
  }

  /**
   * Get all trees that a member belongs to
   */
  async getTreesForMember(memberId: number): Promise<FamilyTree[]> {
    try {
      const member = await FamilyMember.findByPk(memberId, {
        include: [{
          model: FamilyTree,
          as: 'FamilyTrees',
          attributes: ['id', 'name', 'public', 'active']
        }]
      });

      return member?.FamilyTrees || [];
    } catch (error) {
      logger.error('Error fetching trees for member:', error);
      return [];
    }
  }

  /**
   * Check if a member belongs to a specific tree
   */
  async isMemberInTree(memberId: number, treeId: number): Promise<boolean> {
    try {
      const count = await FamilyTree.count({
        where: { id: treeId },
        include: [{
          model: FamilyMember,
          as: 'FamilyMembers',
          where: { id: memberId }
        }]
      });

      return count > 0;
    } catch (error) {
      logger.error('Error checking if member is in tree:', error);
      return false;
    }
  }

  /**
   * Get all members of a tree with their relationships
   */
  async getTreeMembersWithRelationships(treeId: number): Promise<FamilyMember[]> {
    try {
      const tree = await FamilyTree.findByPk(treeId, {
        include: [{
          model: FamilyMember,
          as: 'FamilyMembers',
          attributes: [
            'id', 'first_name', 'last_name', 'email', 'gender', 
            'dob', 'age', 'occupation', 'marital_status', 'parents',
            'siblings', 'spouses', 'children', 'description', 'profile_url'
          ]
        }]
      });

      return tree?.members || [];
    } catch (error) {
      logger.error('Error fetching tree members with relationships:', error);
      return [];
    }
  }
} 