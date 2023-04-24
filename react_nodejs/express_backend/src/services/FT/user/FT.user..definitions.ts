export interface DFTUserDTO {
    first_name: string,
    last_name: string,
    age: string,
    occupation: string,
    partner: string, // FTUser
    marital_status: string,
    is_parent: boolean, // dto boolean
    description: string,
    gender: number, // 1:m 2:f
    profile_url: string,
    links_to: string,
    password: string,
    created_at: string,
    updated_at: string,
}

// | id | int | NO 
// | first_name | varchar(255) | NO |
// | last_name | varchar(255) | NO |
// | age | int | NO |
// | occupation | varchar(255) | NO |
// | marital_status | varchar(255) | NO |
// | gender | int | NO |
// | created_at | datetime | NO |
// | updated_at | datetime | NO |
    
// | profile_url?: | varchar(255) | YES |
// | is_parent?: | tinyint(1) | YES |
// | partner?: | int | YES |
// | description?: | varchar(255) | YES |
// | links_to?: | int | YES |
// | has_ipa?: | tinyint(1) | YES |
// | assigned_ip?: | varchar(255) | YES |
// | password?: | varchar(255) | YES |  

// | id | int | NO 
// | first_name | varchar(255) | NO |
// | last_name | varchar(255) | NO |
// | age | int | NO |
// | occupation | varchar(255) | NO |
// | marital_status | varchar(255) | NO |
// | gender | int | NO |
// | created_at | datetime | NO |
// | updated_at | datetime | NO |