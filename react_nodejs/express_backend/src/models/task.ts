// 'use strict';
// const {
//     Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//     class Task extends Model {
//         /**
//          * Helper method for defining associations.
//          * This method is not a part of Sequelize lifecycle.
//          * The `models/index` file will call this method automatically.
//          */
//         static associate(models) {
//             // define association here
//             Task.belongsTo(models.Objective);
//         }
//     }
//     Task.init({
//         assignees: DataTypes.JSON, //User[]
//         cost: DataTypes.INTEGER,
//         created_by: DataTypes.INTEGER,
//         description: DataTypes.STRING,
//         lead: DataTypes.INTEGER //User
//     }, {
//         sequelize,
//         modelName: 'Task',
//     });
//     return Task;
// };


import {
    DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey
} from 'sequelize';
import db from "../db";
import User from './user';

// order of InferAttributes & InferCreationAttributes is important.
class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
    /**
     * Attributes
     * */
    // 'CreationOptional' is a special type that marks the field as optional
    // when creating an instance of the model (such as using Model.create()).
    declare id: CreationOptional<number>;
    declare assignees: number[]; //User[]
    declare cost: number;
    declare description: string;
    // foreign keys are automatically added by associations methods (like Project.belongsTo)
    // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
    // display an error if created_by is missing.
    declare created_by: ForeignKey<User['id']>;
    declare status: boolean;
    declare updated_by: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    /**
     * End
     * */


    /**
     * Association Getters/Setters
     * */

    /**
     * End
     * */

    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.

    /**
     * Attributes Getters/Setters
     * */
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get taskId(): NonAttribute<number> {
        return this.id
    }
    get taskAssignees(): NonAttribute<number[]> {
        return this.assignees;
    }
    get taskCost(): NonAttribute<number> {
        return this.cost;
    }
    get taskDescription(): NonAttribute<string> {
        return this.description;
    }
    get taskCreatedBy(): NonAttribute<number> {
        return this.created_by;
    }
    get taskUpdatedBy(): NonAttribute<number> {
        return this.updated_by;
    }
    get taskCreatedAt(): NonAttribute<Date> {
        return this.created_at;
    }
    get taskUpdatedAt(): NonAttribute<Date> {
        return this.updated_at;
    }
    get taskStatus(): NonAttribute<boolean> {
        return this.status;
    }

    /**
     * End
     * */

}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER(),
            autoIncrement: true,
            primaryKey: true
        },
        assignees: {
            type: DataTypes.JSON,
        },
        cost: {
            type: DataTypes.INTEGER,
        },
        description: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.STRING,
            defaultValue: new Date().toUTCString()
        },
        created_by: {
            type: DataTypes.STRING,
        },
        updated_at: {
            type: DataTypes.STRING,
        },
        updated_by: {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: 'Tasks',
        sequelize: db // passing the `sequelize` instance is required
    }
);

export default Task;