import axios, { AxiosInstance } from 'axios';

class BaseService {
    request: AxiosInstance;
    APIBaseUrl: string;
    APIPath: string;

    constructor(apiPath: string) {
        this.request = axios.create();
        this.APIBaseUrl = 'http://localhost:4000/api/FT';
        this.APIPath = apiPath;
    }

    async getById(id: number | string) {
        const result = await this.request.get(`${this.APIBaseUrl}/${this.APIPath}/${id}`);
        return result;
    }

}

export default BaseService;