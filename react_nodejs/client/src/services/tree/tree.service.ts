import BaseService from "../base/base.service";

class FamilyTreeService extends BaseService {
  constructor() {
    super('Trees');
  }

  // TODO: ensure previous session is closed, so that this actually returns only the latest, non expired session
  public async getCurrent (id: number) {
    const result = await this.request.get(`${this.APIBaseUrl}/${this.APIPath}/get-data?id=${id}`);

    return result;
  }

  public async update (user: any) {
    const result = await this.request.post(`${this.APIBaseUrl}/${this.APIPath}/set-data`, { data: user });

    return result;
  }
}

export default FamilyTreeService;