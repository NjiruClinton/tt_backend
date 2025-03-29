import { DataTypes, Model } from 'sequelize';
import {sequelize} from "../utils/database";

class Task extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public priority!: 'low' | 'medium' | 'high';
    public status!: 'todo' | 'in_progress' | 'done';
    public deadline!: Date;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: 'medium',
        },
        status: {
            type: DataTypes.ENUM('todo', 'in_progress', 'done'),
            defaultValue: 'todo',
        },
        deadline: {
            type: DataTypes.DATE,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'task',
        tableName: 'tasks',
    }
);

export default Task;