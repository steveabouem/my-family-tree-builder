"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// order of InferAttributes & InferCreationAttributes is important.
class Task extends sequelize_1.Model {
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
    get taskId() {
        return this.id;
    }
    get taskAssignees() {
        return this.assignees;
    }
    get taskCost() {
        return this.cost;
    }
    get taskDescription() {
        return this.description;
    }
    get taskCreatedBy() {
        return this.created_by;
    }
    get taskUpdatedBy() {
        return this.updated_by;
    }
    get taskCreatedAt() {
        return this.created_at;
    }
    get taskUpdatedAt() {
        return this.updated_at;
    }
    get taskStatus() {
        return this.status;
    }
}
Task.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    assignees: {
        type: sequelize_1.DataTypes.JSON,
    },
    cost: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: new Date().toUTCString()
    },
    created_by: {
        type: sequelize_1.DataTypes.STRING,
    },
    updated_at: {
        type: sequelize_1.DataTypes.STRING,
    },
    updated_by: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'Tasks',
    sequelize: db_1.default // passing the `sequelize` instance is required
});
exports.default = Task;
