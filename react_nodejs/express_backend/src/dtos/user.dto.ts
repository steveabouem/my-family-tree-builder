export interface DUserDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    tasks: string; // parse into number[]. USE GETTER?
    roles: string, // parse into number[]. USE GETTER?
}