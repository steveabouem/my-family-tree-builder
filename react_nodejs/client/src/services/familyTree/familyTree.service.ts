import { DFormField } from "@components/common/definitions";
import BaseService from "../base/base.service";
import { AxiosResponse } from "axios";
import { DFamilyTreeDAO } from "@services/api.definitions";

class FamilyTreeService extends BaseService {
  path;
  constructor() {
    super('trees');
    this.path = `${this.APIBaseUrl}/${this.APIPath}`;
  }

  public async getAllForUser(userId: number) {
    const results = this.request.get(`${this.path}/index?member=${userId}`);
    return results;
  }

  public async getOne(treeId: string) {
    const results = this.request.get(`${this.path}/details?id=${treeId}`);
    // const results = this.request.get(`${this.path}/layouts?id=${treeId}`);
    return results;
  }

  public async create(values: DFamilyTreeDAO) { // ! TOFIX: no any
    const results = this.request.post(`${this.path}/create`, { ...values });
    return results;
  }

  public async getMembers(treeId: number) { // ! TOFIX: no any
    const results = this.request.get(`${this.path}/members?id=${treeId}`);
    return results;
  }

  public async addMembers(treeId: number, members: number[]) { // ! TOFIX: no any
    const results = this.request.put(`${this.path}/members?id=${treeId}`, { members });
    return results;
  }

  /*
  * used to populate step form of family genealogy narrator
  */
  public async getGenealogyFormFieldsForStep(step: number): Promise<DFormField[]> {
    // @ts-ignore
    const results: DFormField[] = this.request.get(`${this.path}/narration-fields?step=${step}`);
    return results;
  }
}

export default FamilyTreeService;