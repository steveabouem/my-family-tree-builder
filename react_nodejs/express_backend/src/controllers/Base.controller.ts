import { BaseMiddleware } from "../middleware-classes/base/base.middleware";
import { DTableJoin } from "./common.definitions";

class BaseController<GClassAttributes> {
    tableName: string;
    baseMiddleware: any;

    constructor(table: string) {
        this.tableName = table;
        this.baseMiddleware = new BaseMiddleware(table);
    }

    getList = async (columns?: string, where?: string, joins?: DTableJoin[], limit?: number): Promise<any> => {
        const records = await this.baseMiddleware.getList(columns, where, joins, limit);

        return records;
    };

    getById = async (id: number): Promise<any> => {
        const result = await this.baseMiddleware.getById(id);
        return result;
    };

}

export default BaseController;