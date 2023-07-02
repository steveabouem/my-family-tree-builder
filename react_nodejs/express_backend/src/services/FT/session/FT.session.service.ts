import { Op } from "sequelize";
import { BaseService } from "../../base/base.service";
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import FTSession from "../../../models/FT.session";

class FTSessionService<GSession> extends BaseService<GSession> {
  token: string;
  currentSession?: GSession;

  constructor(p_token: string) {
    super('FTSessions');
    this.token = p_token;
  }

  public setSessionToken = async (p_session: GSession): Promise<string | null> => {
    let encryptedSession = null;

    if (process.env.PASS) {
      encryptedSession = jwt.sign({ session: JSON.stringify(p_session) }, process.env.PASS, { expiresIn: '1800' });
      this.token = encryptedSession;
      // await FTSession.create({ key: encryptedSession, createdAt: new Date }); // not sure yet if I will ever need this
      return encryptedSession;
    }

    return encryptedSession;
  }

  public getSessionObject = (p_keys?: string[]): JwtPayload | null => {
    let sessionData: { [key: string]: unknown } = {};
    if (process.env.PASS) {
      try {
        const sessionJWTObject = jwt.verify(this.token, process.env.PASS);
        if (typeof sessionJWTObject === 'object' && sessionJWTObject !== null) {
          if (p_keys) { // NOTE: If no key is provided, return all session (most likely used in the back)
            for (const sessionKey of p_keys) {
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

  private updateSessionObject = async (p_session: GSession, p_keys: string[]): Promise<boolean> => {
    let currentSession = this.getSessionObject(p_keys);

    if (currentSession && process.env.PASS) {
      const existingValues = { ...currentSession };
      currentSession = { ...existingValues, ...p_session }; //replace all session keys that were updated
      const newSessionKey = jwt.sign(JSON.stringify(currentSession), process.env.PASS); // TODO: check how to maintain the same expiration time even as you update the session. ANd check refresh token
      await FTSession.update({ key: newSessionKey }, {
        where: {
          key: {
            [Op.eq]: this.token
          }
        }
      });
      return true;
    }

    return false;
  }
}
export default FTSessionService;
