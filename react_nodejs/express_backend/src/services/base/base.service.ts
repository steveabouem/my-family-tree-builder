import { Sequelize, QueryTypes } from 'sequelize';
import { DTableJoin } from '../../controllers/common.definitions';
import bcrypt from "bcryptjs";
import db from '../../db';

/**
 * A service receives data of type D...Record and returns data of type D...DTO
 * All the sql queries amd business logic are handled inside the service, the controller is 
 * simply a gateway for the express endpoint to go through to get the data requested
 */
export class BaseService<T> {// NO MATHING MODEL, base fof all of our services
    dataBase: Sequelize;
    tableName: string;
    salt: string;

    constructor(table: string) {
        this.dataBase = db;
        this.tableName = table;
        this.salt = bcrypt.genSaltSync(8);
    }

    async index(p_limit: number): Promise<any> {
        // TODO: no any
        const select = `SELECT * FROM :tableName LIMIT :limit;`
        const results = await this.dataBase.query(select,
            {
                replacements: { tableName: this.tableName, limit: p_limit },
                type: QueryTypes.SELECT
            }
        );
        return results[0];
    }

    async getList(p_columns?: string[], p_where?: string, p_joins?: DTableJoin[], p_limit?: number): Promise<any> {
        let joins = '';
        let where = '';
        let limit = '';
        let selector: string = "*";

        if (p_where) {
            where = p_where;
        }
        if (p_columns) {
            selector = p_columns?.join(', ');
        }
        if (p_joins) {
            joins = p_joins.reduce((p_joinStatement: string, p_currentJoin: DTableJoin) => {
                return `${p_joinStatement} JOIN ${p_currentJoin.tableName} ON ${p_currentJoin.on}`
            }, joins);
        }
        if (p_limit) {
            limit = `LIMIT ${p_limit}`;
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

    async getById(p_id: number): Promise<any> {
        await this.dataBase.authenticate();
        const select = `SELECT * FROM :tableNam} WHERE id = :id;`;
        // TODO: no any
        const record: any = await this.dataBase.query(select, {
            type: QueryTypes.SELECT,
            replacements: { tableName: this.tableName, id: p_id }
        });

        return record[0][0];
    }

    async disable(p_id: number, p_table: string): Promise<boolean> {
        const update = `UPDATE :table SET active = false WHERE id = :id;`
        // TODO: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        await this.dataBase.query(update, {
            type: QueryTypes.UPDATE,
            replacements: { table: p_table, id: p_id }
        }).catch(() => false);

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
    // validateHasAllValues<G extends Record<string, unknown>>(p_values: MyType<G>): boolean {
    //     // this uses the DTO for p_values, hence me using a different generatePrimeSync (the service accepts the record type).
    //     const requiredKeys = Object.keys(p_values) as (keyof G)[];

    //     for (const key of requiredKeys) {
    //         if (!p_values.hasOwnProperty(key) || p_values[key] === null) {
    //             return false;
    //         }
    //     }

    //     return true;
    // }
}