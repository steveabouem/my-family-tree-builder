export interface DUserDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    tasks?: string; // TODO: parse into number[]. USE GETTER?
    roles?: string, // TODO: parse into number[]. USE GETTER?
}

//      User model
    //          first_name: DataTypes.STRING,
    //          last_name: DataTypes.STRING,
    //          email: DataTypes.STRING,
    //          password: {
    //              type: DataTypes.STRING,
    //              set(value) {
    //                  this.setDataValue('password', hash(value));
    //              }
    //     },
    //      tasks: DataTypes.JSON,
    //      roles: DataTypes.JSON,
    //   }, {