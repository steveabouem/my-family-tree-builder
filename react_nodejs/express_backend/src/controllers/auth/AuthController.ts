import bcrypt from "bcryptjs";
import { APILoginResponse, APILogoutResponse, APIRegistrationResponse } from "./auth.definitions";
import BaseController from "../Base.controller";
import { Request, Response } from "express";
import dayjs from "dayjs";
import UserController from "../user/UserController";
import logger from "../../utils/logger";

class AuthController extends BaseController<any> { // ! -TOFIX: no any
    constructor() {
        super('');
    }

    public async register(req: Request, res: Response): Promise<APIRegistrationResponse> {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const formattedValues = { ...req.body, assigned_ips: [ip], created_at: dayjs() };
        const response: APIRegistrationResponse = { authenticated: false, email: '', userId: 0, message: '', error: true, code: 500};
        req.session.details = {};
        
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
                response.userId = newUser.id || 0;
                response.authenticated = true;
                response.email = req.body.email;
                response.code = 200;
            } else {
                logger.error('Unable to create new use: ', { newUser });
                response.code = 401;
            }
        } catch (e: unknown) {
            logger.error('Unable to register ', e);
            response.message = `Caught ERR ${e}`;
            response.code = 400;
        }

        return response;
    }

    public async login(req: Request, res: Response): Promise<APILoginResponse> {
        const response: APILoginResponse = { code: 500, authenticated: false, error: true };
        try {
            const userController = new UserController();
            const currentUser = await userController.getByEmail(req.body.email).catch(e => {
                response.error = true;
                response.message = 'Unable to find user';
                logger.error('! login ! User not found');
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
                    response.sessionId = req.sessionID;
                    response.userId = currentUser.id;
                    response.authenticated = true;
                    response.email = req.body.email;
                    response.firstName = currentUser.first_name;
                    response.lastName = currentUser.last_name;
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
            }
        } catch (e: unknown) {
            response.message = `Login failed - ${e}`;
            logger.error('! login !', e);
            response.code = 400;
        }

        return response;
    }

    public async logout(req: Request, res: Response): Promise<APILoginResponse> {
        const response: APILoginResponse = { code: 500, authenticated: false, error: true };
        try {
            req.session.destroy(() => { });
            response.error = false;
            response.userId = 0;
            response.authenticated = false;
            response.email = req.body.email;
            response.code = 200;

        } catch (e) {
            logger.error('Unable to logout. ', e);
        }
        return response;
    }

    public async changePassword(req: Request, res: Response): Promise<APILoginResponse> {
        const response: APILoginResponse = { code: 500, authenticated: false, error: true };
        try {
            const userController = new UserController();
            const updatedUser = await userController.updatePassword(req.body);
            logger.info('Return from update function: ', updatedUser);
            if (updatedUser) {
                response.email = req.body.email;
                response.firstName = req.body.email;
                response.lastName = req.body.email;
                response.code = 200;
                res.json({ ...response, ...response });
            } else {
                logger.error('Reset password: update function returned nothing');
                response.code = 500;
                res.json(response);
            }

        } catch (e) {
            response.error = true;
            response.code = 500;
            response.message = 'Invalid operation';
            logger.error('Unable to reset password. ', e);
        }
        return response;
    }
}

export default AuthController;
