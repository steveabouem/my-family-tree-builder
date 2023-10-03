import BaseService from "../../base/base.service";

class FamilyService extends BaseService {
  constructor() {
    super('families');
  }
  // TODO: no any
  public getFamilyBullkData = async (ids: string): Promise<any> => {
    // TODO: this request format can be turned into a dynamic  class property/method
    const results = this.request.get(`${this.APIBaseUrl}/${this.APIPath}/index?ids=${ids.split(',')}`);
    return results;
  }

  public getFamilyMembersDetails = async (ids: string): Promise<any> => {
    const results = this.request.get(`${this.APIBaseUrl}/${this.APIPath}/index?ids=${ids.split(',')}`);
    return results;
  }

}

export default FamilyService;