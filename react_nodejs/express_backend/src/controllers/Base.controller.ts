import bcrypt from "bcryptjs";
import { QueryTypes, Sequelize } from "sequelize";
import { DTableJoin } from "./controllers.definitions";
import db from "../db";

class BaseController<GProps> {
    tableName: string;
    dataBase: Sequelize;
    salt: string;

    constructor(table: string) {
        this.dataBase = db;
        this.tableName = table;
        this.salt = bcrypt.genSaltSync(8);
    }

    public async getList(columns?: string[], incomingWhere?: string, incomingJoins?: DTableJoin[], incomingLimit?: number): Promise<any> {
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

    public async getById(id: number): Promise<GProps> {
        const results: any = {}; // TODO: no any
        return results;
    };

    
}

export default BaseController;