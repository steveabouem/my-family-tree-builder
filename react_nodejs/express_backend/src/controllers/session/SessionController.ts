import { DSession } from "../../routes/definitions";
import BaseController from "../Base.controller";
import { DSessionUser } from "../controllers.definitions";
import logger from "../../utils/logger";
import Session from "../../models/Session";
import { userExists } from "../../utils/validators";
import jwt from 'jsonwebtoken';

/** 
// ?: Used to  manage session records, in case we dont use the default express-session (and session store)
**/
class SessionController extends BaseController<DSession> {
    constructor() {
        super('Sessions');
    }

    // ?: creates session secret and initial session record
    public async create(user: DSessionUser): Promise<Session | void> {
        const userIsValid = await userExists(user.userId);
        if (userIsValid) {
            if (process.env.JWT_KEY) { //TODO: migration add_refresh_token Session
                // access token is send back, refresh token is kept in db. 
                // TODO: add session middleware checking if access token is expired or notDeepEqual, and refreshing (longer life) the token if user allowed for specific end point

                const accessToken = jwt.sign({ session: JSON.stringify(user) }, process.env.JWT_KEY, { expiresIn: "1h" });
                const newSession = await Session.create({ key: accessToken, time: new Date, user_id: user.userId });
                console.log({ newSession });
                return newSession;
            }
        } else {
            logger.error('Create User not found');
            throw new Error('User not found');
        }
    }

    public async getCurrent(id: number): Promise<any> { //TODO no any
        try {
            const current = {};
          
        } catch (e) {
            console.log(`Token error: ${e}`);
            return null;
        }
    }
}

export default SessionController;