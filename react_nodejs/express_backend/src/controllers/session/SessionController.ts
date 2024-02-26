import { DSession } from "../../routes/definitions";
import BaseController from "../Base.controller";
import { DEndpointResponse, DSessionUser } from "../controllers.definitions";
import logger from "../../utils/logger";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import store from "../../store";

/** 
// ?: Used to  manage session records, in case we dont use the default express-session (and session store)
**/
class SessionController extends BaseController<DSession> {
    constructor() {
        super('stored_sessions');
    }

    public async getCurrent(req: Request, res: Response) {
        const response: DEndpointResponse = { error: true, status: 400, session: '' };
        try {
            if (req.query?.id) {
                const sessionId = `${req.query.id}`;
                //   @ts-ignore either find a way to use the store, or refactor migration
                const currentSession = await this.dataBase
                    .query("SELECT * FROM `stored_sessions` WHERE `sid` = :s limit 1", { replacements: { s: sessionId }, type: QueryTypes.SELECT })
                    .catch((e: any) => {
                        logger.error('get current session: ', e);
                        response.error = true;
                        response.payload = 'Unable to find session' + e;
                        response.status = 400;

                        res.status(400);
                    });

                res.status(200);
                response.error = false;

                if (currentSession?.length) {
                    //   TODO: FIX TS IGNORES
                    //   @ts-ignore either find a way to use the store, or refactor migration
                    response.payload = currentSession[0];
                } else {
                    response.message = 'No existing session.';
                }
            } else {
                throw new Error('Missing mandatory parameters.');
            }
        } catch (e) {
            response.error = true;
            response.payload = 'Unable to find session' + e;
            response.status = 400;

            res.status(400);
        }
        console.log('current session', { response });

        res.json(response);
    }
}

export default SessionController;