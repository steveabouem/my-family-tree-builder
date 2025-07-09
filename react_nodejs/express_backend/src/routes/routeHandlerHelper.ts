import { Response} from "express";
import logger from "@utils/logger";
import { ServiceResponseWithPayload } from "@services/service.definitions";

export const  sendResponseFromControllerMethod = <RequestPayload, ResponseType>(
  requestPayload: RequestPayload,
  action: (payload: RequestPayload) =>  Promise<ServiceResponseWithPayload<ResponseType>>,
  response: Response, actionName: string
): any => {
    logger.info('Processing ', {actionName, payload: requestPayload});

    action(requestPayload)
    .then((data: ServiceResponseWithPayload<ResponseType>) => {
      logger.info('Call succesfull: ', {data});
      response.status(data.code);
      response.json(data);
    })
    .catch((e:unknown) => {
      response.status(500);
      logger.error(actionName, ': failed operation: ', e);
      response.json('error');
    });
  };