# ETasks Management API

A production-ready GraphQL API built with Node.js, TypeScript, Apollo Server, Express, and Sequelize (PostgreSQL) featuring:
- JWT authentication
- Task management with pagination
- CORS configuration
- Comprehensive testing suite

## 🚀 Features

- **Authentication**
    - User signup/login with JWT
    - Protected routes
    - Password hashing

- **Tasks**
    - Create, read, update, delete tasks
    - Pagination with cursor-based navigation
    - Status filtering (todo/in_progress/done)
    - Title search

- **Infrastructure**
    - TypeScript support
    - PostgreSQL integration
    - CORS configuration
    - Jest testing suite
    - Production-ready setup

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/NjiruClinton/tt_backend.git
    cd tt_backend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:
    ```dotenv
    DB_HOST=localhost
    DB_DATABASE=tasks
    DB_USER=clinton
    DB_PASS=Clint1235
    DB_PORT=5432
    DB_EXTERNAL_URL=for_prod_only_to_avoid_ssh
   JWT_SECRET=your_jwt_secret
    ```

2. Allow origins in `app.ts` corsOptions object.

## Usage

### prod db connection
```ts
const sequelize = new Sequelize(DB_EXTERNAL_URL as string, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        }
    })
```

### development db connection
```ts
const sequelize = new Sequelize(
    DB_DATABASE as string,
    DB_USER as string,
    DB_PASSWORD as string,
    {
        host: DB_HOST,
        port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
        dialect: 'postgres',
        logging: false,
    })
```

1. Compile the TypeScript files to JavaScript (build for render deploy):
    ```sh
    npm install && npm run build
    ```

2. Start the application:
    ```sh
    node index.js
    ```

## Scripts

- `npm run build`: Compiles the TypeScript files to JavaScript.
- `npm start`: Runs the compiled JavaScript files.
- `npm run dev`: Runs the application in development mode using `ts-node`.

## Folder Structure
```
.
├── index.ts
├── jest.config.js
├── package-lock.json
├── package.json
├── readme.md
├── src
│   ├── api
│   │   └── server.ts
│   ├── app.ts
│   ├── config
│   ├── graphql
│   │   ├── resolvers
│   │   │   ├── auth.ts
│   │   │   └── task.ts
│   │   ├── schema.ts
│   │   └── schemas
│   │       ├── auth.ts
│   │       └── task.ts
│   ├── models
│   │   ├── Tasks.ts
│   │   └── User.ts
│   ├── test
│   │   ├── auth.test.ts
│   │   ├── pagination.test.ts
│   │   ├── setup.ts
│   │   ├── statusCount.test.ts
│   │   ├── tasks.test.ts
│   │   └── utils.ts
│   ├── types
│   │   └── user.ts
│   └── utils
│       ├── auth.ts
│       ├── context.ts
│       ├── database.ts
│       └── validators.ts
└── tsconfig.json
```