import bcrypt from "bcryptjs";
import { DFTLoginFields } from "./auth.definitions";
import BaseController from "../Base.controller";
import { NextFunction, Request, Response } from "express";
import { DEndpointResponse, DSessionUser } from "../controllers.definitions";
import dayjs from "dayjs";
import UserController from "../user/UserController";
import logger from "../../utils/logger";

class AuthController extends BaseController<any> { // ! -TOFIX: no any
    constructor() {
        super('');
    }

    public async register(req: Request, res: Response) {
        const response: DEndpointResponse = { error: true, status: 400, session: '' };
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const formattedValues = { ...req.body, assigned_ips: [ip], created_at: dayjs() };

        try {
            const userController = new UserController();
            const duplicate = await userController.getByEmail(req.body.email);
            if (duplicate) {
                response.error = true;
                response.payload = 'Email address is already in use';
                response.status = 400;

                res.status(400);
            }

            const newUser = await userController.create(formattedValues).catch(e => {
                logger.error('! Auth.register !', e);
                response.error = true;
                response.payload = 'Unable to create user';
                response.status = 400;

                res.status(400);
            });

            if (newUser) {
                req.session.details = {
                    userId: newUser.id,
                    authenticated: true,
                    firstName: newUser.first_name,
                    lastName: newUser.last_name,
                    email: req.body.email
                };
                req.session.save();
                response.error = false;
                response.payload = {
                    userId: newUser.id,
                    authenticated: true,
                    email: req.body.email
                };
                response.status = 200;

                res.status(200);
            }
        } catch (e: unknown) {
            response.message = `Caught ERR ${e}`;
            response.status = 400;

            res.status(400);
        }

        res.json(response);
    }

    public async login(req: Request, res: Response) {
        const response: DEndpointResponse = { error: true, status: 400, session: '' };

        try {
            const userController = new UserController();
            const currentUser = await userController.getByEmail(req.body.email).catch(e => {
                response.error = true;
                response.payload = 'Unable to find user';
                response.status = 400;
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
                    response.payload = {
                        sessionId: req.sessionID,
                        userId: currentUser.id,
                        authenticated: true,
                        email: req.body.email,
                        firstName: currentUser.first_name,
                        lastName: currentUser.last_name,
                    };

                    response.status = 200;

                    res.status(200);
                    req.session.save((e) => {
                        response.error = true;
                        response.payload = 'Unable to login';
                        response.status = 500;
                        res.status(500);
                        logger.error('! Auth.login !', e);
                    });
                } else {
                    response.error = true;
                    logger.error('! login ! User authentication failed');
                    response.payload = 'Unable to authenticate user';
                    response.status = 400;

                    res.status(400);
                }
            }
        } catch (e: unknown) {
            response.message = `Login failed - ${e}`;
            logger.error('! login !', e);
            response.status = 400;
            res.status(400);
        }

        res.json(response);
    }

    public async logout(req: Request, res: Response) {
        const response: DEndpointResponse = { error: true, status: 400, session: '' };
        req.session.destroy(() => { });
        response.error = false;
        response.payload = {
            userId: 0,
            authenticated: false,
            email: req.body.email
        };
        response.status = 200;

        res.status(200);
        res.json(response);
    }
}

export default AuthController;
