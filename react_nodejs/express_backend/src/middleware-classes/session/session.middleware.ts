import { BaseMiddleware } from "../base/base.middleware";
import logger from "../../utils/logger";
import { Request } from "express";

class SessionMiddleware<GSession> extends BaseMiddleware<GSession> {
  constructor() {
    super('Sessions');
  }

  public isAuthenticated(req: Request) {
    return req.session.authenticated;
  }

}

export default SessionMiddleware;