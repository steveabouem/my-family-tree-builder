import { BaseService } from "../services/base/base.service";
import { DTableJoin } from "./common.definitions";

class BaseController<GClassAttributes> {
    tableName: string;
    service: any;

    constructor(p_table: string) {
        this.tableName = p_table;
        this.service = new BaseService();
    }

    getList = async (p_id: number, p_columns?: string, p_where?: string, p_joins?: DTableJoin[], p_limit?: string): Promise<any> => {
        let joins = '';
        let limit = '';
        if (p_joins) {
            joins = p_joins.reduce((p_joinStatement: string, p_currentJoin: DTableJoin) => {
                return `${p_joinStatement} JOIN ${p_currentJoin.tableName} ON ${p_currentJoin.on}`
            }, joins);
        }

        if (p_limit) {
            limit = `limit ${p_limit}`;
        }

        const select = `
            SELECT ${p_columns || '*'}
            ${p_joins?.join(' JOIN ')}
            FROM ${this.tableName}
            ${p_where || ''}
            ${limit}
            ;
        `;

        const result = await this.service.getById(select);
        return result;
    };

    getById = async (p_id: number): Promise<any> => {
        const select = `
            SELECT *
            FROM ${this.tableName} WHERE id = ${p_id}
            ;
        `;

        const result = await this.service.getById(select);
        return result;
    };

}

export default BaseController;