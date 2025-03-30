import { setupTestServer, stopTestServer, clearDatabase, createTestUser } from './utils';
import { gql } from 'apollo-server-express';
import Task from "../models/Tasks";

describe('Task Status Counts', () => {
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
        // Create test tasks with different statuses
        await Promise.all([
            Task.create({ title: 'Task 1', userId: testUser.id, status: 'todo' }),
            Task.create({ title: 'Task 2', userId: testUser.id, status: 'todo' }),
            Task.create({ title: 'Task 3', userId: testUser.id, status: 'in_progress' }),
            Task.create({ title: 'Task 4', userId: testUser.id, status: 'done' })
        ]);
    });

  const GET_STATUS_COUNTS = gql`
      query GetStatusCounts {
          myTaskStatusCounts {
              todo
              in_progress
              done
              total
          }
      }
  `;

    test('should return correct status counts', async () => {
        const res = await testServer.apolloServer.executeOperation({
            query: GET_STATUS_COUNTS,
        }, {
            contextValue: { user: testUser }
        });

        expect(res.errors).toBeUndefined();
        expect(res.data?.myTaskStatusCounts.todo).toBe(2);
        expect(res.data?.myTaskStatusCounts.in_progress).toBe(1);
        expect(res.data?.myTaskStatusCounts.done).toBe(1);
        expect(res.data?.myTaskStatusCounts.total).toBe(4);
    });
});