import { ServiceResponseWithPayload } from "./types";

export const generateResponseData = <R>(data: R): ServiceResponseWithPayload<R> => {
  return {
    error: true,
    code: 500,
    payload: data
  };
};

/** 
 * extract the dataValues property of any Sequelize Model that a service function would need
 * @param bindings 
 * @param entity 
 * @returns 
 */
export async function extractSingleDataValuesFrom(entity: any, bindings: any): Promise<any> {
  const record = await entity.findOne(bindings);
  if (record?.dataValues) {
    return record.dataValues;
  }

  return null;
}

export async function extractGroupDataValuesFrom(entity: any, bindings: any): Promise<any> {
  const records = await entity.findAll(bindings);

  if (records?.length) {
    return records.map((r: any) => r.dataValues)
  }

  return null;
