import Session from "../models/Session";
import { extractSingleDataValuesFrom } from "./serviceHelpers";
import { APIGetSessionResponse, ServiceResponseWithPayload } from "./types";
import { Op } from "sequelize";

export const getCurrentSession = async (id: string): Promise<ServiceResponseWithPayload<APIGetSessionResponse>> => {
  const currentSession = await extractSingleDataValuesFrom(Session, {where: {sid: {[Op.eq]: id}}});
    let response = {
      error: true,
      code: 500,
      payload: { authenticated: false, active: false }
    };

  if (currentSession) {
    response.payload.active = true;
    response.code = 200;
    response.error = false;
  } else {
    response.code = 200;
    response.error = false;
  }

  return response;
}