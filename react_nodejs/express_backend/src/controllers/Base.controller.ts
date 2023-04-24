import { BaseService } from "../services/base/base.service";
import { DTableJoin } from "./common.definitions";

class BaseController<GClassAttributes> {
    tableName: string;
    baseService: any;

    constructor(p_table: string) {
        this.tableName = p_table;
        this.baseService = new BaseService(p_table);
    }

    getList = async (p_columns?: string, p_where?: string, p_joins?: DTableJoin[], p_limit?: number): Promise<any> => {
        const records = await this.baseService.getList(p_columns, p_where, p_joins, p_limit);

        return records;
    };

    getById = async (p_id: number): Promise<any> => {
        const result = await this.baseService.getById(p_id);
        return result;
    };

}

export default BaseController;