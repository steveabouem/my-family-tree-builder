import { Router, Response, Request } from "express";
import logger from "../utils/logger";
import { APIRequestPayload } from "../controllers/controllers.definitions";

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
  public sendResponseFromControllerMethod<P>(action: (r: Request) => Promise<APIRequestPayload<P>>, actionName: string): void {
    const {request, response} = this;
    logger.info('Processing ', {actionName, payload: request?.body});

    action(request)
    .then((data: APIRequestPayload<P>) => {
      logger.info('Call succesfull: ', {data});
      response.status(data.code);
      response.json(data);
    })
    .catch((e:unknown) => {
      response.status(500);
      logger.error(actionName, ': failed operation: ', e);
    });
  }
}

export default RequestHelper;