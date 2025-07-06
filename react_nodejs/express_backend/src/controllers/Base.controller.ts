import bcrypt from "bcryptjs";
import { QueryTypes, Sequelize } from "sequelize";
import db from "../db";

class BaseController<GProps> {
    tableName: string;
    dataBase: Sequelize;
    salt: string;


    constructor(table: string) {
        this.dataBase = db;
        this.tableName = table;
        this.salt = bcrypt.genSaltSync(8);
    }
  /*
  * Controller methods take the request and send the service payload to the 
  * response helper method. The response to the client is handled there
  */
}

export default BaseController;