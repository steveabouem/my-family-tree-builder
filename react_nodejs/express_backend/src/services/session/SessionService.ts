import { QueryTypes } from "sequelize";
import Session from "../../models/Session";
import logger from "../../utils/logger";

export class SessionService  {
  // async getCurrentSession(sessionId: string): Promise<Session | null> {
  //   try {
  //     const currentSession = await Session.sequelize?.query(
  //       "SELECT * FROM `Sessions` WHERE `sid` = :s limit 1", 
  //       { 
  //         replacements: { s: sessionId }, 
  //         type: QueryTypes.SELECT 
  //       }
  //     );

  //     if (currentSession && currentSession.length > 0) {
  //       return currentSession[0] as Session;
  //     }
      
  //     return null;
  //   } catch (e: unknown) {
  //     logger.error('get current session: ', e);
  //     return null;
  //   }
  // }

  // async createSession(sessionData: any): Promise<Session | null> {
  //   try {
  //     return await Session.create(sessionData);
  //   } catch (e: unknown) {
  //     logger.error('Failed to create session:', e);
  //     return null;
  //   }
  // }

  // async updateSession(sessionId: string, updateData: any): Promise<Session | null> {
  //   try {
  //     const session = await Session.findOne({ where: { sid: sessionId } });
  //     if (!session) return null;
      
  //     await session.update(updateData);
  //     return session;
  //   } catch (e: unknown) {
  //     logger.error('Failed to update session:', e);
  //     return null;
  //   }
  // }

  // async deleteSession(sessionId: string): Promise<boolean> {
  //   try {
  //     const session = await Session.findOne({ where: { sid: sessionId } });
  //     if (!session) return false;
      
  //     await session.destroy();
  //     return true;
  //   } catch (e: unknown) {
  //     logger.error('Failed to delete session:', e);
  //     return false;
  //   }
  // }

  // async validateSession(sessionId: string): Promise<boolean> {
  //   try {
  //     const session = await this.getCurrentSession(sessionId);
  //     if (!session) return false;
      
  //     // Check if session is expired
  //     if (session.expires && new Date() > new Date(session.expires)) {
  //       return false;
  //     }
      
  //     return true;
  //   } catch (e: unknown) {
  //     logger.error('Failed to validate session:', e);
  //     return false;
  //   }
  // }
} 