import { BaseService } from "../services/base/base.service";
import { DTableJoin } from "./common.definitions";

class BaseController<GClassAttributes> {
    tableName: string;
    baseService: any;

    constructor(table: string) {
        this.tableName = table;
        this.baseService = new BaseService(table);
    }

    getList = async (columns?: string, where?: string, joins?: DTableJoin[], limit?: number): Promise<any> => {
        const records = await this.baseService.getList(columns, where, joins, limit);

        return records;
    };

    getById = async (id: number): Promise<any> => {
        const result = await this.baseService.getById(id);
        return result;
    };

}

export default BaseController;