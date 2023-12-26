import { Sequelize, QueryTypes } from 'sequelize';
import { DTableJoin } from '../../controllers/controllers.definitions';
import bcrypt from "bcryptjs";
import db from '../../db';
import winston from 'winston';

/**
 * A middleware receives data of type D...Record and returns data of type D...DTO
 * All the sql queries amd business logic are handled inside the middleware, the controller is 
 * simply a gateway for the express endpoint to go through to get the data requested
 */
export class BaseMiddleware<T> {// NO MATHING MODEL, base fof all of our middlewares
  dataBase: Sequelize;
  tableName: string;
  salt: string;

  constructor(table: string) {
    this.dataBase = db;
    this.tableName = table;
    this.salt = bcrypt.genSaltSync(8);
  }

  async index(limit: number): Promise<any> {
    // TODO: no any
    const select = `SELECT * FROM :tableName LIMIT :limit;`
    const results = await this.dataBase.query(select,
      {
        replacements: { tableName: this.tableName, limit: limit },
        type: QueryTypes.SELECT
      }
    );
    return results[0];
  }

  async getList(columns?: string[], incomingWhere?: string, incomingJoins?: DTableJoin[], incomingLimit?: number): Promise<any> {
    let joins = '';
    let where = '';
    let limit = '';
    let selector: string = "*";

    if (where) {
      where = incomingWhere || '';
    }
    if (columns) {
      selector = columns?.join(', ');
    }
    if (joins) {
      joins = incomingJoins?.reduce((joinStatement: string, currentJoin: DTableJoin) => {
        return `${joinStatement} JOIN ${currentJoin.tableName} ON ${currentJoin.on}`
      }, joins) || '';
    }
    if (limit) {
      limit = `LIMIT ${incomingLimit}`;
    }

    const select = `
            SELECT :selector
            FROM :tableName
            :joins
            :where
            :limit
            ;
        `;

    const results = await this.dataBase.query(select, {
      type: QueryTypes.SELECT,
      replacements: {
        selector,
        tableName: this.tableName,
        joins,
        where,
        limit
      }
    });
    return results[0];
  }

  async getById(id: number): Promise<any> {
    // await this.dataBase.authenticate();
    // const select = `SELECT * FROM :tableName WHERE id = :id;`;
    // // TODO: no any
    // const record: any = await this.dataBase.query(select, {
    //   type: QueryTypes.SELECT,
    //   replacements: { tableName: this.tableName, id: id }
    // });

    // return record[0][0];
  }

  async disable(id: number, table: string): Promise<boolean> {
    const update = `UPDATE :table SET active = false WHERE id = :id;`

    await this.dataBase.query(update, {
      type: QueryTypes.UPDATE,
      replacements: { table: table, id: id }
    }).catch((e: unknown) => {
      winston.log('Disable error' ,  e);
      return false;
    });

    return true;
  }

  getDTOMapping = (): Record<keyof T, any> => {
    // TODO: figure out how to map the generic type's keys to retur an object and use that as return getById and the likes
    // @ts-expect-error
    const keys = Object.keys({} as T);
    console.log({ keys });

    const obj: Record<keyof T, any> = {} as Record<keyof T, any>;
    for (const key of keys) {
      obj[key as keyof T] = null; // Initialize each key with null value
    }
    console.log(obj);

    return obj;
  }

  // TODO: ask around for this, chatGPT failed
  // validateHasAllValues<G extends Record<string, unknown>>(values: MyType<G>): boolean {
  //     // this uses the DTO for values, hence me using a different generatePrimeSync (the middleware accepts the record type).
  //     const requiredKeys = Object.keys(values) as (keyof G)[];

  //     for (const key of requiredKeys) {
  //         if (!values.hasOwnProperty(key) || values[key] === null) {
  //             return false;
  //         }
  //     }

  //     return true;
  // }
}