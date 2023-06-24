import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as dotenv from 'dotenv';
import FTSessionService from "../../src/services/FT/session/FT.session.service";

dotenv.config();

const { JWT }: { [key: string]: string | undefined } = process.env;
export const verifyJWTRequestToken = (p_req: Request, p_res: Response, p_next: NextFunction) => {
  const token = p_req.cookies.FT;
  const sessionService = new FTSessionService(token);
  const session = sessionService.getSessionObject();

  return session;
}