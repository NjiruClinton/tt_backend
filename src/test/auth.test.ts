import { setupTestServer, stopTestServer, clearDatabase } from './utils';
import { gql } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server-express';

describe('Authentication', () => {
    let testServer: { apolloServer: ApolloServer; httpServer: any; app: any };

    beforeAll(async () => {
        testServer = await setupTestServer();
    });

    afterAll(async () => {
        await stopTestServer();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

  const SIGNUP = gql`
      mutation Signup($input: SignupInput!) {
          signup(input: $input) {
              token
              user {
                  id
                  email
              }
          }
      }
  `;

    test('should sign up a new user', async () => {
        const { apolloServer } = testServer;

        const res = await apolloServer.executeOperation({
            query: SIGNUP,
            variables: {
                input: {
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@example.com',
                    password: 'password123'
                }
            }
        });

        expect(res.errors).toBeUndefined();
        expect(res.data?.signup.token).toBeDefined();
        expect(res.data?.signup.user.email).toBe('test@example.com');
    });
})