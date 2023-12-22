import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as dotenv from 'dotenv';
import FTSessionMiddleware from "../../src/middleware-classes/session/FT.session.middleware";

dotenv.config();

const { JWT }: { [key: string]: string | undefined } = process.env;
export const verifyJWTRequestToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.FT;
  const sessionMiddleware = new FTSessionMiddleware();
  const session = sessionMiddleware.getSessionData(token);

  return session;
}