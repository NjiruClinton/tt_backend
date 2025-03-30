import express from 'express';
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createContext } from './utils/context';
import {sequelize} from "./utils/database";
import {authResolvers} from "./graphql/resolvers/auth";
import {taskResolvers} from "./graphql/resolvers/task";
import {authTypeDefs} from "./graphql/schemas/auth";
import {taskTypeDefs} from "./graphql/schemas/task";

export async function createApp() {
    // Initialize database
    await sequelize.sync({ alter: true });
    console.log('Database connected and synced');

    const app = express()
    
    const corsOptions = {
        origin: ["https://tts-front-git-main-njiruclintons-projects.vercel.app", "https://tts-front-omega.vercel.app"], //, "http://localhost:3000"
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    }
    app.use(cors(corsOptions))
    
    const schema = makeExecutableSchema({
        typeDefs: [authTypeDefs, taskTypeDefs],
        resolvers: [authResolvers, taskResolvers],
    });

    const server = new ApolloServer({
        schema,
        context: createContext,
    });

    await server.start()
    
    server.applyMiddleware({
        app,
        cors: false, // Disable Apollo's built-in CORS
        path: '/graphql'
    });

    // server.applyMiddleware({ app });

    return { app, server }
}