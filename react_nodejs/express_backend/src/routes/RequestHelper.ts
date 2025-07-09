import { Router, Response, Request, NextFunction } from "express";
import logger from "../utils/logger";
import { APIRequestPayload } from "../controllers/controllers.definitions";

class RequestHelper {
  request;
  response;
  next;

  constructor(req: Request, res: Response, next?: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }
/*
* Receives req, response and a description of the controller action
* handles logging the error
*/
  public sendResponseFromControllerMethod<P>(action: (r: Request) => Promise<APIRequestPayload<P>>, actionName: string): void {
    const {request, response} = this;
    let responseDAta = null;
    logger.info('Processing ', {actionName, payload: request?.body});

    action(request)
    .then((data: APIRequestPayload<P>) => {
      logger.info('Call succesfull: ', {data});
      response.status(data.code);
      responseDAta = data;
    })
    .catch((e:unknown) => {
      response.status(500);
      logger.error(actionName, ': failed operation: ', e);
    });
    
    response.json(responseDAta);
  }
}

export default RequestHelper;