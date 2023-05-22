import BaseService from "../../base/base.service";
import { DUserRelatedFamily} from "./user.definitions";

class UserService extends BaseService {
    async getUserRelatedFamilies(p_id: number): Promise<DUserRelatedFamily> {
        const results = await this.request(this.APIBaseUrl + '')
    }
}