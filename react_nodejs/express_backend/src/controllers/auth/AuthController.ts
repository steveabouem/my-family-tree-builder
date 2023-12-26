import bcrypt from "bcryptjs";
import { DFTLoginFields } from "./Auth.definitions";
import FTUser from "../../models/FT.user";
import FTIP from "../../models/FT.ip";
import BaseController from "../Base.controller";
import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import { DEndpointResponse } from "../controllers.definitions";
import dayjs from "dayjs";
import UserController from "../user/UserController";
import SessionController from "../session/SessionController";

class AuthController extends BaseController<any> { // TODO: no any
    constructor() {
        super('FTIPs');
    }

    // verifyUserIp = async (id: number): Promise<boolean> => {
    //     const ftUserMiddleware = new FTUserMiddleware();
    //     // TODO: catch return false doesnt actually catch falty logic, 
    //     // just wrong syntax and maybe wrong typing. FIX
    //     const currentUser: DUserRecord = await ftUserMiddleware.getById(id);
    //     return this.authorized_ips.includes(currentUser.authorizedIps);
    // }

    // verifyIp = async (currentIp?: string | string[]): Promise<boolean> => {
    //     if (!currentIp) {
    //         return false;
    //     }

    //     // TODO: SQL BINDINGS
    //     const ip = FTIP.findOne({ where: { value: currentIp } });
    //     return !!ip;
    // }

    // verifyUser = async (values: DFTLoginFields): Promise<Partial<DFTUserDTO> | null> => {
    //     const currentUser = await FTUser.findOne({ where: { email: values.email } });
    //     if (!currentUser) {
    //         return null;
    //     }

    //     const passwordValid = bcrypt.compareSync(values.password, currentUser.password);

    //     if (passwordValid) {
    //         console.log('User is verified', currentUser);

    //         return { ...currentUser.dataValues, password: '' };
    //     }

    //     return null
    // }

    public register = async (req: Request, res: Response) => {
        const response: DEndpointResponse = { error: true, status: 400, session: '' };
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const formattedValues = { ...req.body, assigned_ips: [ip], created_at: dayjs() };
        console.log('SESH', req.session);

        try {
            // const registrationPayload: DApiResponse | void = await this.processRegister(req).catch((e: unknown) => {
            //     logger.log('error', 'Registration: ' + e);
            //     response.status = 400;
            //     response.message = 'Unable to create session.' + e;
            // });
            const userController = new UserController();
            const duplicate = await userController.getByEmail(req.body.email);
            if (duplicate) {
                response.status = 400;
                response.error = true;
                response.data = 'Email address is already in use';
                res.status(400);
            }

            const newUser = await userController.create(formattedValues).catch(e => {
                response.status = 400;
                response.error = true;
                response.data = 'Unable to create user';
                res.status(400);
            });

            if (newUser) {

                req.session.data = {
                        userId: newUser.id || 0,
                        authenticated: true,
                        email: req.body.email
                };
                res.status(200);
                response.error = false;
                response.data = newUser.id;
                response.status = 200;
                console.log('SESSION TABLE', req.session);
            }
        } catch (e: unknown) {
            response.status = 400;
            response.message = `Caught ERR ${e}`;
            res.status(400);
        }
        console.log('rEADY TO SEND: ', response);
        
        res.json(response);
    }


    // private processRegister = async (req: Request): Promise<Partial<DEndpointResponse>> => {
    //     const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    //     const formattedValues = { ...req.body, assigned_ips: [ip], created_at: dayjs() };
    //     // const expiration = dayjs().add(1, 'days').toDate();
    //     const payload: Partial<DEndpointResponse> = { error: true, data: undefined };

    //     try {
    //         // TODO: use user controller or helper function to match spouse's first and last name and return id here.
    //         // in the front, it will be some sort of dd that will use the MiddlewareWorker, and add the id to the form values
    //         // This will go in the profile Selection, no need to crowd registration w it
    //         const userController = new UserController();
    //         const duplicate = await userController.getByEmail(req.body.email);
    //         if (duplicate) {
    //             payload.error = true;
    //             payload.data = 'Email address is already in use';
    //         }

    //         const newUser = await userController.create(formattedValues).catch(e => {
    //             payload.error = true;
    //             payload.data = 'Unable to create user';
    //         });

    //         if (newUser) {
    //             // const sessionController = new SessionController();
    //             // create session record and get id
    //             // const newSession = await sessionController.create({
    //             //     id: newUser.id || 0,
    //             //     email: newUser.email,
    //             //     firstName: newUser.first_name,
    //             //     lastName: newUser.last_name,
    //             // });

    //             req.session.user_id = newUser.id || 0; 
    //             req.session.authenticated = true;
    //             payload.error = false;
    //             payload.data = newUser.id;
    //             // if (newSession) {
    //             //     payload.error = false;
    //             //     payload.data = {
    //             //         id: newSession.id.toString(),
    //             //         cookie: {
    //             //             originalMaxAge: 86400000,
    //             //             expires: expiration,
    //             //         },
    //             //     }
    //             // } else {
    //             //     payload.error = true;
    //             //     payload.data = 'Failed creating a session';
    //             // }
    //         }
    //     } catch (e: unknown) {
    //         logger.log('error', 'Process register failed', e);
    //         payload.error = true;
    //         payload.data = `Process register failed ${e}`;
    //     }

    //     return payload;
    // }

}

export default AuthController;
