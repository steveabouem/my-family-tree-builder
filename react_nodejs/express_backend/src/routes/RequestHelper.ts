import { Router, Response, Request } from "express";
import logger from "../utils/logger";

class RequestHelper {
  request;
  response;

  constructor(req: Request, res: Response) {
    this.request = req;
    this.response = res;
  }

  public sendResponseFromControllerMethod<P>(action: (r: Request, rs: Response) => Promise<P>, actionName: string): void {
    const {request, response} = this;
    logger.info('Processing ', {actionName, payload: request?.body});

    action(request, response)
    .then((data: P) => {
      logger.info('Call succesfull: ', {data})
      response.json(data);
    })
    .catch((e:unknown) => {
      logger.error(actionName, ': failed operation: ', e);
    });
  }
}

export default RequestHelper;