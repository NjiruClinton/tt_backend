import { gql } from 'apollo-server-express';

export const taskTypeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    priority: String!
    status: String!
    deadline: String
    userId: ID!
    createdAt: String!
    updatedAt: String!
  }
  
   type TaskEdge {
    cursor: String!
    node: Task!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type TaskConnection {
    edges: [TaskEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  input PaginationInput {
    first: Int!       # Number of items to fetch
    after: String     # Cursor for pagination (null for first page)
    orderBy: String   # Field to order by (e.g., "createdAt")
    orderDirection: String # "ASC" or "DESC"
    search: String
    status: String = ""
  }
  
  input CreateTaskInput {
    title: String!
    description: String
    priority: String
    status: String
    deadline: String
  }

  input UpdateTaskInput {
    title: String
    description: String
    priority: String
    status: String
    deadline: String
  }
   type TaskStatusCount {
    todo: Int!
    in_progress: Int!
    done: Int!
    total: Int!
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
    myTasks: [Task!]!
    tasksPaginated(input: PaginationInput!): TaskConnection!
    myTasksPaginated(input: PaginationInput!): TaskConnection!
    myTaskStatusCounts: TaskStatusCount!
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }
`;