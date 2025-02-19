import bcrypt from "bcryptjs";
import { DLoginResponse, DLogoutResponse, DRegistrationResponse } from "./auth.definitions";
import BaseController from "../Base.controller";
import { Request, Response } from "express";
import { DEndpointResponse } from "../controllers.definitions";
import dayjs from "dayjs";
import UserController from "../user/UserController";
import logger from "../../utils/logger";

class AuthController extends BaseController<any> { // ! -TOFIX: no any
    constructor() {
        super('');
    }

    public async register(req: Request, res: Response) {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const formattedValues = { ...req.body, assigned_ips: [ip], created_at: dayjs() };
        let responseBody: DRegistrationResponse = { authenticated: false, email: '', userId: 0, message: '' };
        const response: Partial<DEndpointResponse<DRegistrationResponse>> = { error: true, code: 500, session: '' };

        try {
            const userController = new UserController();
            const duplicate = await userController.getByEmail(req.body.email);
            if (duplicate) {
                response.error = true;
                response.message = 'Email address is already in use';
                response.code = 400;
            }

            const newUser = await userController.create(formattedValues).catch(e => {
                logger.error('! Auth.register !', e);
                response.error = true;
                response.message = 'Unable to create user';
                response.code = 400;
            });

            if (newUser) {
                logger.info('New user created ', newUser);
                req.session.details = {
                    userId: newUser.id,
                    authenticated: true,
                    firstName: newUser.first_name,
                    lastName: newUser.last_name,
                    email: req.body.email
                };
                req.session.save();
                response.error = false;
                responseBody = {
                    userId: newUser.id,
                    authenticated: true,
                    email: req.body.email
                };
                response.code = 200;

            }
            res.status(response.code || 500);
        } catch (e: unknown) {
            logger.error('Unable to register ', e);
            response.message = `Caught ERR ${e}`;

            res.status(400);
        }

        res.json(responseBody);
    }

    public async login(req: Request, res: Response) {
        const response: Partial<DEndpointResponse<DLoginResponse>> = { error: true, session: '', code: 500 };
        const responseBody = {
            sessionId: '',
            userId: 0,
            authenticated: false,
            email: '',
            firstName: '',
            lastName: '',
        };

        try {
            const userController = new UserController();
            const currentUser = await userController.getByEmail(req.body.email).catch(e => {
                response.error = true;
                response.message = 'Unable to find user';
                response.code = 400;
                logger.error('! login ! User not found');

                res.status(400);
            });

            if (currentUser) {
                const passwordIsValid = bcrypt.compareSync(req.body.password, currentUser.password);

                if (passwordIsValid) {
                    req.session.details = {
                        userId: currentUser.id,
                        authenticated: true,
                        email: req.body.email,
                        firstName: currentUser.first_name,
                        lastName: currentUser.last_name,
                    };

                    response.error = false;
                    responseBody.sessionId = req.sessionID;
                    responseBody.userId = currentUser.id;
                    responseBody.authenticated = true;
                    responseBody.email = req.body.email;
                    responseBody.firstName = currentUser.first_name;
                    responseBody.lastName = currentUser.last_name;
                    response.code = 200;

                    req.session.save((e) => {
                        response.error = true;
                        response.message = 'Unable to login';
                        response.code = 500;
                        logger.error('! Auth.login !', e);
                    });
                } else {
                    response.error = true;
                    logger.error('! login ! User authentication failed');
                    response.message = 'Unable to authenticate user';
                    response.code = 400;

                }
                res.status(response.code);
            }
        } catch (e: unknown) {
            response.message = `Login failed - ${e}`;
            logger.error('! login !', e);
            res.status(400);
        }

        res.json(responseBody);
    }

    public async logout(req: Request, res: Response) {
        const response: Partial<DEndpointResponse<DLoginResponse>> = { error: true, session: '', code: 500 };
        const responseBody: DLogoutResponse = {
            email: '', authenticated: false
        };
        try {
            req.session.destroy(() => { });
            response.error = false;
            responseBody.userId = 0;
            responseBody.authenticated = false;
            responseBody.email = req.body.email;
    
            res.status(200);
            res.json(responseBody);
        } catch(e) {
            logger.error('Unable to logout. ', e);
        }
    }
}

export default AuthController;
