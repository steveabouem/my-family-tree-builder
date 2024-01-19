import { DSession } from "../../routes/definitions";
import BaseController from "../Base.controller";
import { DEndpointResponse, DSessionUser } from "../controllers.definitions";
import logger from "../../utils/logger";
import Session from "../../models/Session";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import dayjs from "dayjs";

/** 
// ?: Used to  manage session records, in case we dont use the default express-session (and session store)
**/
class SessionController extends BaseController<DSession> {
    constructor() {
        super('Sessions');
    }

    // ?: creates session secret and initial session record
    public async create(user: DSessionUser): Promise<Session | void> {
        
    }

    public async getCurrent(req: Request, res: Response) {
        const response: DEndpointResponse = { error: true, status: 400, session: '' };
        try {
            if (req.query?.id) {
                const sessionId = `${req.query.id}`;
                //   @ts-ignore either find a way to use the store, or refactor migration
                const currentSession = await this.dataBase
                    .query("SELECT * FROM `Sessions` WHERE `sid` = :s limit 1", { replacements: { s: sessionId }, type: QueryTypes.SELECT })
                    .catch((e: any) => {
                        logger.error('get current session: ', e);
                        response.status = 400;
                        response.error = true;
                        response.data = 'Unable to find session' + e;
                        res.status(400);
                    });

                res.status(200);
                response.error = false;

                if (currentSession?.length) {
                    //   TODO: FIX TS IGNORES
                    //   @ts-ignore either find a way to use the store, or refactor migration
                    response.data = currentSession[0];
                } else {
                    response.message = 'No existing session.';
                }
            } else {
                throw new Error('Missing mandatory parameters.');
            }
        } catch (e) {
            response.status = 400;
            response.error = true;
            response.data = 'Unable to find session' + e;
            res.status(400);
        }
        console.log({ response });

        res.json(response);
    }
}

export default SessionController;