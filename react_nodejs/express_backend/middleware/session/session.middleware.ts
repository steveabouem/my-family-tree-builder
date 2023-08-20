import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as dotenv from 'dotenv';
import FTSessionService from "../../src/services/FT/session/FT.session.service";

dotenv.config();

const { JWT }: { [key: string]: string | undefined } = process.env;
export const verifyJWTRequestToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.FT;
  const sessionService = new FTSessionService();
  const session = sessionService.getSessionData(token);

  return session;
}