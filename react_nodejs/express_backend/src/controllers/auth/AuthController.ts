import bcrypt from "bcryptjs";
import { DFTLoginFields } from "./Auth.definitions";
import BaseController from "../Base.controller";
import { NextFunction, Request, Response } from "express";
import { DEndpointResponse, DSessionUser } from "../controllers.definitions";
import dayjs from "dayjs";
import UserController from "../user/UserController";

class AuthController extends BaseController<any> { // TODO: no any
    constructor() {
        super('FTIPs');
    }

    // verifyUserIp = async (id: number): Promise<boolean> => {
    //     const userMiddleware = new UserMiddleware();
    //     // TODO: catch return false doesnt actually catch falty logic, 
    //     // just wrong syntax and maybe wrong typing. FIX
    //     const currentUser: DUserRecord = await userMiddleware.getById(id);
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

    // verifyUser = async (values: DFTLoginFields): Promise<Partial<DUserDTO> | null> => {
    //     const currentUser = await User.findOne({ where: { email: values.email } });
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
        const formattedValues = { ...req.body, assigned_ips: [ip], created_at: dayjs(), parent_2: 2 };

        try {
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
                    userId: newUser.id,
                    authenticated: true,
                    email: req.body.email
                };
                res.status(200);
                response.error = false;
                response.data = {
                    userId: newUser.id,
                    authenticated: true,
                    email: req.body.email
                };
                response.status = 200;
                // console.log('SESSION TABLE', req.session);
            }
        } catch (e: unknown) {
            response.status = 400;
            response.message = `Caught ERR ${e}`;
            res.status(400);
        }
        // console.log('rEADY TO SEND: ', response);

        res.json(response);
    }

    public login = async (req: Request, res: Response) => {
        const response: DEndpointResponse = { error: true, status: 400, session: '' };

        try {
            const userController = new UserController();
            const currentUser = await userController.getByEmail(req.body.email).catch(e => {
                response.status = 400;
                response.error = true;
                response.data = 'Unable to find user';
                res.status(400);
            });

            if (currentUser) {
                const passwordIsValid = bcrypt.compareSync(req.body.password, currentUser.password);

                if (passwordIsValid) {
                    req.session.data = {
                        userId: currentUser.id,
                        authenticated: true,
                        email: req.body.email,
                    };
                    res.status(200);
                    response.error = false;
                    response.data = {
                        sessionId: req.sessionID,
                        userId: currentUser.id,
                        authenticated: true,
                        email: req.body.email
                    };
                    response.status = 200;
                } else {
                    response.status = 400;
                    response.error = true;
                    response.data = 'Unable to authenticate user';
                    res.status(400);
                }
            }
        } catch (e: unknown) {
            response.status = 400;
            response.message = `Login failed - ${e}`;
            res.status(400);
        }
        // console.log('rEADY TO SEND: ', response);

        res.json(response);
    }

    public logout = async (req: Request, res: Response) => {
        const response: DEndpointResponse = { error: true, status: 400, session: '' };
        req.session.destroy(() => { });
        res.status(200);
        response.error = false;
        response.data = {
            userId: 0,
            authenticated: false,
            email: req.body.email
        };
        response.status = 200;
        // console.log('RESPONSE: ', response);
        res.json(response);
    }
}

export default AuthController;
