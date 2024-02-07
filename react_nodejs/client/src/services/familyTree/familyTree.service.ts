import BaseService from "../base/base.service";

class FamilyTreeService extends BaseService {
  constructor() {
    super('trees');
  }

 public async getAllForUser(userId: number) {
  const results = this.request.get(`${this.APIBaseUrl}/${this.APIPath}/get_all?member=${userId}`);
  return results;
 }
 
 public async create(values: any) { // ! TOFIX: no any
  const results = this.request.post(`${this.APIBaseUrl}/${this.APIPath}/create`, {...values});
  return results;
 }
}

export default FamilyTreeService;