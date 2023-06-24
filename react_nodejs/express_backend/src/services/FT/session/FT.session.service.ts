import { Op } from "sequelize";
import { BaseService } from "../../base/base.service";
import jwt, { JwtPayload } from 'jsonwebtoken';
import FTSession from "../../../models/FT.session";
import * as dotenv from 'dotenv';

dotenv.config();

const { JWT }: { [key: string]: string | undefined } = process.env;

class FTSessionService<GSession> extends BaseService<GSession> {
  token: string;
  currentSession?: GSession;

  constructor(p_token: string) {
    super('FTSessions');
    this.token = p_token;
  }

  public setSessionToken = async (p_session: GSession): Promise<string | null> => {
    if (!JWT) {
      return null;
    }

    const encryptedSession = jwt.sign(JSON.stringify(p_session), JWT, { expiresIn: '30mn' });
    this.token = encryptedSession;
    await FTSession.create({ key: encryptedSession, createdAt: new Date }); // not sure yet if I will ever need this

    return encryptedSession;
  }

  public getSessionObject = (p_keys?: string[]): JwtPayload | null => {
    let sessionData: { [key: string]: unknown } = {};
    if (JWT) {
      try {
        const sessionJWTObject = jwt.verify(this.token, JWT);
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

    if (currentSession && JWT) {
      const existingValues = { ...currentSession };
      currentSession = { ...existingValues, ...p_session }; //replace all session keys that were updated
      const newSessionKey = jwt.sign(JSON.stringify(currentSession), JWT); // TODO: check how to maintain the same expiration time even as you update the session. ANd check refresh token
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
