/** TRACKER */
export interface DTrackerRegistrationFields { //registration form fields

}

/** FT */
export interface DFTRegistrationFields { //registration form fields
    firstName: string;
    lastName: string;
    age: number;
    occupation?: string;
    partner?: string;
    maritalStatus?: string;
    isParent: boolean;
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