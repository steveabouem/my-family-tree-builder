import { InferAttributes, Model } from "sequelize";
import { ModelQueryParans, ServiceResponseWithPayload } from "./types";
import logger from "../utils/logger";

export const generateResponseData = <R>(data: R): ServiceResponseWithPayload<R> => {
  return {
    error: true,
    code: 500,
    payload: data
  };
};

// TODO: need to refactor this as described
/**
 * extract the dataValues property of any Sequelize Model that a service function would need
 * @param bindings 
 * @param entity 
 * @returns 
 */
export async function extractDataValuesFrom(entity: any, bindings: any): Promise<any> {
  logger.info('Bindings received ', bindings)
  const record = await entity.findOne(bindings);
  if (record?.dataValues) {
    return record.dataValues;
  }

  return null;
}