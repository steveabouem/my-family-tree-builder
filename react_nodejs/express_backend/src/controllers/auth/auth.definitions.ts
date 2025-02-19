export type DRegistrationResponse = {
    authenticated: boolean;
    email: string;
    userId?: number;
    message?: string;
}

export type DLoginResponse = {
    sessionId: string;
    authenticated: boolean;
    email: string;
    firstName: string;
    lastName: string;
    userId?: number;
}

export type DLogoutResponse = {
    authenticated: boolean;
    email: string;
    userId?: number;
}

export interface DFTRegistrationFields { //registration form fields
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