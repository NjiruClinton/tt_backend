import { gql } from 'apollo-server-express';

export const authTypeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input SignupInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: User
  }
  
  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload
    login(input: LoginInput!): AuthPayload
    updateUser(input: UpdateUserInput!): User!
    deleteUser: Boolean!
  }
`;