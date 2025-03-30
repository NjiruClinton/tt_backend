import { ApolloServer } from 'apollo-server-express';
import { createApp } from '../app';
import { Server } from 'http';
import { Express } from 'express';
import User from '../models/User';
import {sequelize} from "../utils/database";
import {DocumentNode} from "graphql";

let testServer: TestServer | null = null;

interface TestServer {
    apolloServer: ApolloServer;
    httpServer: Server;
    app: Express;
}

export const setupTestServer = async (): Promise<TestServer> => {
    const { app, server } = await createApp(); // Get both app and server
    const httpServer = app.listen(0);

    return { apolloServer: server, httpServer, app };
};


export const stopTestServer = async (): Promise<void> => {
    if (!testServer) return;

    await new Promise<void>((resolve) => {
        testServer!.httpServer.close(() => resolve());
    });
    await testServer.apolloServer.stop();
    testServer = null;
};

export const clearDatabase = async (): Promise<void> => {
    await sequelize.sync({ force: true });
};

export const createTestUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}): Promise<User> => {
    return await User.create(userData);
};

export const getTestServerToken = (userId: number): string => {
    //todo: JWT token generation
    const jwt = require('jsonwebtoken');
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '1h',
    });
};
