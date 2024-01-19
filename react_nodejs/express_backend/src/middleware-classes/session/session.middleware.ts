import { Session } from "express-session";
import FTSession from "../../models/Session";
import { DSessionUser } from "../../routes/definitions";
import { BaseMiddleware } from "../base/base.middleware";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { userExists } from "../../utils/validators";
import { NextFunction } from "express";
import logger from "../../utils/logger";

class FTSessionMiddleware<GSession> extends BaseMiddleware<GSession> {
  constructor() {
    super('Sessions');
  }

  // ?: creates session secret and initial session record
  public createSession = async (user: DSessionUser, next: NextFunction): Promise<FTSession | void> => {
    const userIsValid = await userExists(user.id);
    try {
      if (userIsValid) {
        if (process.env.JWT_KEY) {
          const token = jwt.sign({ session: JSON.stringify(user) }, process.env.JWT_KEY);
          const newSession = await FTSession.create({ key: token, time: new Date, user_id:  user.id});
          console.log({newSession});
          return newSession;
        }
      } else {
        throw new Error('User not found');
      }
    } catch(e: unknown) {
      next('createSession ' + e); // pass error to next function
    }
  }

  public getSessionData = (token: string, keys?: string[]): JwtPayload & { id: number } | null => {
    // let sessionData: { [key: string]: unknown, id: number } = { id: 0 };
    // if (process.env.JWT_KEY) {
    //   try {
    //     const signedSessionJWT = jwt.verify(token, process.env.JWT_KEY);
    //     console.log('Session JSON: ', signedSessionJWT);
    //     // @ts-ignore
    //     const signedSessionJWTObject = JSON.parse(signedSessionJWT.session);
    //     console.log('VaLUE OF OBJ: ', signedSessionJWTObject);

    //     if (signedSessionJWTObject !== null) {
    //       console.log('SIGNED SESSION OBJECT: ', signedSessionJWTObject);
    //       if (keys) { // ?: If no key is provided, return all session (will most likely be used in the back)
    //         // @ts-ignore
    //         const sessionValues = JSON.parse(signedSessionJWTObject.session);
    //         for (const sessionKey of keys) {
    //           sessionData[sessionKey] = sessionValues[sessionKey];
    //         }

    //         return sessionData; // ?: I will have to ignore the jwt keys from the payload 
    //       } else {
    //         console.log('sess data no keys ', signedSessionJWTObject);
    //         return signedSessionJWTObject;
    //       }
    //     }

    //     return null;
    //     // TODO: typing
    //   } catch (e) {
    //     console.log(`Token error: ${e}`);
    //     return null;
    //   }
    // }

    return null;
  }

  // private updateSessionObject = async (session: GSession, keys: string[]): Promise<boolean> => {
  // let currentSession = this.getUserSessionData(keys);

  // if (currentSession && process.env.JWT_KEY) {
  //   const existingValues = { ...currentSession };
  //   currentSession = { ...existingValues, ...session }; //replace all session keys that were updated
  //   const newSessionKey = jwt.sign(JSON.stringify(currentSession), process.env.JWT_KEY); // TODO: check how to maintain the same expiration time even as you update the session. ANd check refresh token
  //   await FTSession.update({ key: newSessionKey }, {
  //     where: {
  //       key: {
  //         [Op.eq]: this.token
  //       }
  //     }
  //   });
  //   return true;
  // }

  //   return false;
  // }
}
export default FTSessionMiddleware;