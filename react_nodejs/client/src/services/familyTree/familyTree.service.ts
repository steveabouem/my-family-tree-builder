import BaseService from "../base/base.service";

class FamilyTreeService extends BaseService {
  constructor() {
    super('trees');
  }

  public async getAllForUser(userId: number) {
    const results = this.request.get(`${this.APIBaseUrl}/${this.APIPath}/index?member=${userId}`);
    return results;
  }

  public async getOne(treeId: string) {
    const results = this.request.get(`${this.APIBaseUrl}/${this.APIPath}/details?id=${treeId}`);
    return results;
  }

  public async create(values: any) { // ! TOFIX: no any
    const results = this.request.post(`${this.APIBaseUrl}/${this.APIPath}/create`, { ...values });
    return results;
  }

  public async getMembers(treeId: number) { // ! TOFIX: no any
    const results = this.request.get(`${this.APIBaseUrl}/${this.APIPath}/members?id=${treeId}`);
    return results;
  }
  
  public async addMembers(treeId: number, members: number[]) { // ! TOFIX: no any
    const results = this.request.put(`${this.APIBaseUrl}/${this.APIPath}/members?id=${treeId}`, {members});
    return results;
  }
}

export default FamilyTreeService;