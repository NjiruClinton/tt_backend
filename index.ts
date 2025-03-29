// import connectDatabase, {sequelize} from "./src/utils/database"
//
// require('dotenv').config();
// import http from 'http';
// import https from 'https';
// import fs from 'fs';
// import app from './src/app';
// // import logger from './utils/logger';
// let port = process.env.APP_PORT || 4100
// const server = http.createServer(app)
//
// server.listen(port, async () => {
//     // logger.info(`Server started and listening on ${process.env.APP_PORT}`);
//     console.log(`Server started and listening on ${port}`);
//     await connectDatabase();
//     await sequelize.sync();
// });
// import { createApp } from './app';
import dotenv from 'dotenv';
import {createApp} from "./src/app";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        const app = await createApp();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/graphql`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();