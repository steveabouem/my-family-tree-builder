import { APIEndpointResponse } from "../controllers.definitions";

export type APIRegistrationResponse = APIEndpointResponse & {
    authenticated: boolean;
    email: string;
    userId?: number;
    message?: string;
}

export type APILoginResponse = APIEndpointResponse & {
    authenticated: boolean;
    email?: string;
    firstName?: string;
    lastName?: string;
    userId?: number;
}

export type APILogoutResponse = APIEndpointResponse & {
    authenticated: boolean;
    email: string;
    userId?: number;
}

export interface APIRegistrationFields { //registration form fields
    firstName: string;
    lastName: string;
    age: number;
    occupation?: string;
    partner?: string;
    maritalStatus?: string;
    isParent: number; //1/0
    description: string;
    gender: string;
    profileUrl?: string;
}

export interface DFTLoginFields { //registration form fields
    email: string;
    password: string;
}


/** ADMIN */

export interface DAdminRegistrationFields { //registration form fields

}