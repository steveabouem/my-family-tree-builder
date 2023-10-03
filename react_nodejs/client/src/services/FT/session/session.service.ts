import BaseService from "../../base/base.service";

class FTSessionService extends BaseService {
  constructor() {
    super('session');
  }

  public getCurrentUser = async (cookie: string) => {
    const result = await this.request.post(`${this.APIBaseUrl}/${this.APIPath}/get-data`, { data: cookie });

    return result;
  }

  public setCurrentUser = async (user: any) => {
    const result = await this.request.post(`${this.APIBaseUrl}/${this.APIPath}/set-data`, { data: user });

    return result;
  }
}

export default FTSessionService;