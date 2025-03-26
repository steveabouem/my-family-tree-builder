import { DUserRelatedFamily } from "@services/api.definitions";
import BaseService from "../base/base.service";

class UserService extends BaseService {
  async getRelatedFamilies(id?: string): Promise<DUserRelatedFamily[]> {
    if (!id) {
      // ! -TOFIX: Logging
      return [];
    }

    const results = await this.request.get(this.APIBaseUrl + `${id}/families`)
    return [];
  }

  // ! -TOFIX: no any
  getExtendedFamilies = async (id: number): Promise<any> => {
    // get all families of the same level in the tree (families grouped by parents and children' spouses' parents) for a given user
    const results = this.request.get(`${this.APIBaseUrl}/${this.APIPath}/${id}/extended`);
    return results;
  }
}

export default UserService;