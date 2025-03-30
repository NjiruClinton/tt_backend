import { setupTestServer, stopTestServer, clearDatabase, createTestUser, getTestServerToken } from './utils';
import { gql } from 'apollo-server-express';

describe('Tasks', () => {
    let testServer: any;
    let testUser: any;
    let authToken: string;

    beforeAll(async () => {
        testServer = await setupTestServer();
        testUser = await createTestUser({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'password123'
        });
        authToken = getTestServerToken(testUser.id);
    });

    afterAll(async () => {
        await stopTestServer();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

  const CREATE_TASK = gql`
      mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) {
              id
              title
              status
          }
      }
  `;

    test('should create a task', async () => {
        const res = await testServer.apolloServer.executeOperation({
            query: CREATE_TASK,
            variables: {
                input: {
                    title: 'Test Task',
                    status: 'todo'
                }
            }
        }, {
            contextValue: {
                user: testUser,
                req: {
                    headers: { authorization: `Bearer ${authToken}` }
                }
            }
        });

        expect(res.errors).toBeUndefined();
        expect(res.data?.createTask.title).toBe('Test Task');
        expect(res.data?.createTask.status).toBe('todo');
    });
})