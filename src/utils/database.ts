import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
// import logger from './logger';

dotenv.config();

const {
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD,
    DB_EXTERNAL_URL
} = process.env;

const sequelize = new Sequelize(
    DB_DATABASE as string,
    DB_USER as string,
    DB_PASSWORD as string,
    {
        host: DB_HOST,
        port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
        dialect: 'postgres',
        logging: false,
    }
);
// const sequelize = new Sequelize(DB_EXTERNAL_URL as string, {
//     dialect: 'postgres',
//     protocol: 'postgres',
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false,
//         },
//     }
// });

export async function connectDatabase() {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully!");
    } catch (error) {
        // logger.error('Failed to connect to database!', {
        //     meta: error,
        // });
        throw error;
    }
}

export { sequelize };
export default connectDatabase;