import BaseService from "../../base/base.service";

class SessionService extends BaseService {
  constructor() {
    super('session');
  }

  public getCurrentUser = async (cookie: string) => {
    const result = await this.request.post(`${this.APIBaseUrl}/${this.APIPath}/get-data`, { data: cookie });
    console.log('RESULT FROM GETSESSION: ', result);

    return result;
  }

  public setCurrentUser = async (user: any) => {
    const result = await this.request.post(`${this.APIBaseUrl}/${this.APIPath}/set-data`, { data: user });
    console.log('RESULT FROM SETSESSION: ', result);

    return result;
  }
}

export default SessionService;