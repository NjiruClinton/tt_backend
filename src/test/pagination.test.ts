import { setupTestServer, stopTestServer, clearDatabase, createTestUser } from './utils';
import { gql } from 'apollo-server-express'
import Task from "../models/Tasks";

describe('Task Pagination', () => {
    let testServer: any;
    let testUser: any;

    beforeAll(async () => {
        testServer = await setupTestServer();
        testUser = await createTestUser({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'password123'
        });
    });

    afterAll(async () => {
        await stopTestServer();
    });

    beforeEach(async () => {
        await clearDatabase();
        // Create test tasks
        await Promise.all([
            Task.create({ title: 'Task 1', userId: testUser.id, status: 'todo' }),
            Task.create({ title: 'Task 2', userId: testUser.id, status: 'in_progress' }),
            Task.create({ title: 'Task 3', userId: testUser.id, status: 'done' })
        ]);
    });

  const GET_TASKS_PAGINATED = gql`
      query GetTasksPaginated($input: PaginationInput!) {
          myTasksPaginated(input: $input) {
              edges {
                  node {
                      id
                      title
                  }
              }
              pageInfo {
                  hasNextPage
              }
              totalCount
          }
      }
  `;

    test('should return paginated tasks', async () => {
        const res = await testServer.apolloServer.executeOperation({
            query: GET_TASKS_PAGINATED,
            variables: {
                input: {
                    first: 2
                }
            }
        }, {
            contextValue: { user: testUser }
        });

        expect(res.errors).toBeUndefined();
        expect(res.data?.myTasksPaginated.edges.length).toBe(2);
        expect(res.data?.myTasksPaginated.totalCount).toBe(3);
        expect(res.data?.myTasksPaginated.pageInfo.hasNextPage).toBe(true);
    })
})