/** TRACKER */
export interface APITrackerRegistrationFields { //registration form fields

}

/** FT */
export interface APIFTRegistrationFields { //registration form fields
    firstName: string;
    lastName: string;
    age?: number;
    occupation?: string;
    partner?: string;
    maritalStatus?: string;
    isParent: number; //1/0
    description: string;
    gender: string;
    profileUrl?: string;
}

export interface APIFTLoginFields { //registration form fields
    email: string;
    password: string;
}


/** ADMIN */

export interface APIAdminRegistrationFields { //registration form fields

}