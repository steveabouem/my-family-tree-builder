import BaseController from "../Base.controller";
import { APIEndpointResponse, APISession, APISessionUser } from "../controllers.definitions";
import logger from "../../utils/logger";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

/** 
// ?: Used to  manage session records, in case we dont use the default express-session (and session store)
**/
class SessionController extends BaseController<APISession> {
    constructor() {
        super('sessions');
    }

    public async getCurrent(req: Request, res: Response): Promise<APISession | null> {
        const response: any = { code: 500, authenticated: false, error: true };
        try {
            if (req.query?.id) {
                const sessionId = `${req.query.id}`;
                //   @ts-ignore either find a way to use the store, or refactor migration
                const currentSession = await this.dataBase
                    .query("SELECT * FROM `Sessions` WHERE `sid` = :s limit 1", { replacements: { s: sessionId }, type: QueryTypes.SELECT })
                    .catch((e: any) => {
                        logger.error('get current session: ', e);
                        response.error = true;
                        response.payload = 'Unable to find session' + e;
                        response.status = 400;

                        res.status(400);
                    });
                res.status(200);

                response.code = 200;
                response.error = false;

                if (currentSession?.length) {
                    response.current = currentSession[0];
                } else {
                    response.message = 'No existing session.';
                }
            } else {
                throw new Error('Missing mandatory parameters.');
            }
        } catch (e) {
            response.error = true;
            logger.error('Unable to retrieve session ', e);
            response.message = 'Unable to find session' + e;
            response.status = 400;

            res.status(400);
        }
        logger.info('current session', { response });

        return (response);
    }
}

export default SessionController;