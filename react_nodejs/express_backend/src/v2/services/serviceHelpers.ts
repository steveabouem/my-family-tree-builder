import { ServiceResponseWithPayload } from "@services/service.definitions";

export const generateResponseData = <R>(data: R): ServiceResponseWithPayload<R> => {
  return {
      error: true,
      code: 500,
      payload: data
    };
};