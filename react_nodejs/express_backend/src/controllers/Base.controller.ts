import bcrypt from "bcryptjs";
import { QueryTypes, Sequelize } from "sequelize";
import { APIEndpointResponse, APITableJoin } from "./controllers.definitions";
import db from "../db";

class BaseController<GProps> {
    tableName: string;
    dataBase: Sequelize;
    salt: string;
    defaultResponse: Pick<APIEndpointResponse, 'code' | 'error'>;
    
    constructor(table: string) {
        this.dataBase = db;
        this.defaultResponse = { error: true, code: 400 };
        this.tableName = table;
        this.salt = bcrypt.genSaltSync(8);
    }

    public async getList(columns?: string[], incomingWhere?: string, incomingJoins?: APITableJoin[], incomingLimit?: number): Promise<any> {
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
            joins = incomingJoins?.reduce((joinStatement: string, currentJoin: APITableJoin) => {
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

    public async getById(id: number): Promise<GProps> {
        const results: any = {}; // ! -TOFIX: no any
        return results;
    };

    // public async handleRequest(execution: Promise<unknown>, next?: NextFunction) {
        // maybe use this funciton for all controller METHODS, pass the method's logic as a promise (execution) and return the response?
    //     const response: DEndpointResponse = { error: true, status: 400, session: '', data: undefined };
    //     const data = await execution.catch (e) {
    //         response.status = 400;
    //         response.error = true;
    //         response.payload= 'Unable to find session' + e;
    //         res.status(400);
    //     }
        

    //         res.status(200);
    //         response.error = false;

    //         if (currentSession?.length) {
    //             //   TODO: FIX TS IGNORES
    //             //   @ts-ignore either find a way to use the store, or refactor migration
    //             response.payload= currentSession[0];
    //         } else {
    //             response.message = 'No existing session.';
    //         }
           
       
    // }

}

export default BaseController;