import { BaseMiddleware } from "../../base/base.middleware";
import jwt, { JwtPayload } from 'jsonwebtoken';

class FTSessionMiddleware<GSession> extends BaseMiddleware<GSession> {
  constructor() {
    super('FTSessions');
  }

  public setSession = async (session: GSession): Promise<string | null> => {
    // INFO: receives safe user profile (no pwd or other sensitive info) and signs it, returns it as header to be set as a token in front
    let signedUser = null;
    console.log('session value before encryption: ', session);

    if (process.env.JWT_KEY) {
      signedUser = jwt.sign({ session: JSON.stringify(session) }, process.env.JWT_KEY);
      // await FTSession.create({ key: encryptedSession, createdAt: new Date }); // not sure yet if I will ever need this
      console.log('PASS DETECTED: ', signedUser);
      return signedUser;
    }

    return signedUser;
  }

  public getSessionData = (token: string, keys?: string[]): JwtPayload & { id: number } | null => {
    let sessionData: { [key: string]: unknown, id: number } = { id: 0 };
    if (process.env.JWT_KEY) {
      try {
        const signedSessionJWT = jwt.verify(token, process.env.JWT_KEY);
        console.log('Session JSON: ', signedSessionJWT);
        // @ts-ignore
        const signedSessionJWTObject = JSON.parse(signedSessionJWT.session);
        console.log('VaLUE OF OBJ: ', signedSessionJWTObject);

        if (signedSessionJWTObject !== null) {
          console.log('SIGNED SESSION OBJECT: ', signedSessionJWTObject);
          if (keys) { // INFO: If no key is provided, return all session (will most likely be used in the back)
            // @ts-ignore
            const sessionValues = JSON.parse(signedSessionJWTObject.session);
            for (const sessionKey of keys) {
              sessionData[sessionKey] = sessionValues[sessionKey];
            }

            return sessionData; // INFO: I will have to ignore the jwt keys from the payload 
          } else {
            console.log('sess data no keys ', signedSessionJWTObject);
            return signedSessionJWTObject;
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
export default FTSessionMiddleware;