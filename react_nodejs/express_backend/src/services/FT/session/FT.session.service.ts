import { Op } from "sequelize";
import { BaseService } from "../../base/base.service";
import jwt, { JwtPayload } from 'jsonwebtoken';
import FTSession from "../../../models/FT.session";

class FTSessionService<GSession> extends BaseService<GSession> {
  constructor() {
    super('FTSessions');
    // this.token = token; //stringified version of data to be hashed (no need if we always use the current user)
  }

  public setSessionUser = async (session: GSession): Promise<string | null> => {
    // receives safe user profile (no pwd or other sensitive info) and signs it, returns it as header to be set as a token in front
    let signedUser = null;
    console.log('SET SESSION USER: ', session);

    if (process.env.JWT_KEY) {
      signedUser = jwt.sign({ session: JSON.stringify(session) }, process.env.JWT_KEY, { expiresIn: '1800' });
      // await FTSession.create({ key: encryptedSession, createdAt: new Date }); // not sure yet if I will ever need this
      console.log('PASS DETECTED: ', signedUser);
      return signedUser;
    }

    return signedUser;
  }

  public getUserSessionData = (token: string, keys?: string[]): JwtPayload | null => {
    let sessionData: { [key: string]: unknown } = {};

    if (process.env.JWT_KEY) {
      try {
        const sessionJWTObject = jwt.verify(token, process.env.JWT_KEY);
        if (typeof sessionJWTObject === 'object' && sessionJWTObject !== null) {
          if (keys) { // NOTE: If no key is provided, return all session (most likely used in the back)
            for (const sessionKey of keys) {
              sessionData[sessionKey] = sessionJWTObject[sessionKey];
            }
            return sessionData; // NOTE: I will have to ignore the jwt keys from the payload 
          } else {
            return sessionJWTObject;
          }
        }

        return null;
        // TODO: typing
      } catch (e) {
        console.log(`Token error: ${e}`);
        return null;
      }
    }

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
export default FTSessionService;
