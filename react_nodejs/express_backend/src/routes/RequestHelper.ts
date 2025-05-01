import { Router, Response, Request } from "express";
import logger from "../utils/logger";

class RequestHelper {
  request;
  response;

  constructor(req: Request, res: Response) {
    this.request = req;
    this.response = res;
  }
/*
* Receives req, response and a description of the controller action
* handles logging the error
*/
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