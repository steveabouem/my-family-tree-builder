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
    assigned_ip: string[],
    has_ipa: boolean, //has authority to update authorized ips
    links_to: string,
    user_id: number,
    password: string
}

// age: DataTypes.INTEGER,
// assigned_ip: DataTypes.STRING, //each FTUser has an ip assigned to them. ip can be shared between multiple"
// description: DataTypes.STRING,
// first_name: DataTypes.STRING,
// gender: DataTypes.INTEGER, // 1:m 2:f"
// has_ipa: DataTypes.BOOLEAN, //has authority to update authorized ips"
// is_parent: DataTypes.BOOLEAN,
// last_name: DataTypes.STRING,
// links_to: DataTypes.INTEGER, // FTFam"
// marital_status: DataTypes.STRING,
// occupation: DataTypes.STRING,
// partner: DataTypes.INTEGER, // FTUser"
// profile_url: DataTypes.STRING,
// user_id | int
// password | string