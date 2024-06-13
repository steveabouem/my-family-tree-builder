import { BaseMiddleware } from "../base/base.middleware";

// ! TODO: THIS LOOKS USELESS SO frameElement. MIGHT DELETE THIS MIDDLEWARE ENTIRELY
class SessionMiddleware<GSession> extends BaseMiddleware<GSession> {
  constructor() {
    super('Sessions');
  }

}

export default SessionMiddleware;