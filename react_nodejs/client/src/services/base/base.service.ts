import axios, { AxiosInstance } from 'axios';


class BaseService {
    request: AxiosInstance;
    APIBaseUrl: string;

    constructor() {
        this.request = axios.create();
        this.APIBaseUrl = 'http://localhost:4000/api/FT';
    }


}

export default BaseService;