import express from 'express';
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

    const app = express();

    const schema = makeExecutableSchema({
        typeDefs: [authTypeDefs, taskTypeDefs],
        resolvers: [authResolvers, taskResolvers],
    });

    const server = new ApolloServer({
        schema,
        context: createContext,
    });

    await server.start();
    server.applyMiddleware({ app });

    return { app, server }
}