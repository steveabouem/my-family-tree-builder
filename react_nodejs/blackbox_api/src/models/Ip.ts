import {
    Association, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute,
} from 'sequelize';
import db from "db";
import User from './User';


class FTIP extends Model<InferAttributes<FTIP>, InferCreationAttributes<FTIP>> {
    declare id: CreationOptional<number>;
    declare value: string;
    declare owners: number[]; // User[]
    declare members?: NonAttribute<User[]>; // Note this is optional since it's only populated when explicitly requested in code

    get FTIPId(): NonAttribute<number> {
        return this.id;
    }
    get FTIPValue(): NonAttribute<string> {
        return this.value;
    }
    get FTIPOwners(): NonAttribute<number[]> {
        return this.owners;
    }

    declare static associations: {
        projects: Association<FTIP, FTIP>;
    };
}

FTIP.init(
    {
        id: {
            type: DataTypes.INTEGER(),
            autoIncrement: true,
            primaryKey: true
        },
        value: { type: DataTypes.STRING },
        owners: { type: DataTypes.JSON },

    },
    {
        timestamps: false,
        tableName: 'ip_addresses',
        sequelize: db // passing the `sequelize` instance is required
    }
);

export default FTIP;