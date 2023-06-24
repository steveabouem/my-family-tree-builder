import BaseService from "../../base/base.service";
import { DUserRelatedFamily } from "./user.definitions";

class FTUserService extends BaseService {
  async getRelatedFamilies(p_id?: string): Promise<DUserRelatedFamily[]> {
    if (!p_id) {
      // TODO: Logging
      return [];
    }

    const results = await this.request.get(this.APIBaseUrl + `${p_id}/families`)
    console.log({ results });
    return [];
  }

  // TODO: no any
  getExtendedFamilies = async (p_id: number): Promise<any> => {
    // get all families of the same level in the tree (families grouped by parents and children' spouses' parents) for a given user
    const results = this.request.get(`${this.APIBaseUrl}/${this.APIPath}/${p_id}/extended`);
    return results;
  }
}

export default FTUserService;