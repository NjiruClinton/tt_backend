import Task from "../../models/Tasks"
import {col, fn, Op} from "sequelize";

type TaskOrderBy = keyof Task

export const taskResolvers = {
    Query: {
        tasks: async () => {
            return await Task.findAll();
        },
        task: async (_: any, { id }: { id: string }) => {
            return await Task.findByPk(id);
        },
        myTasks: async (_: any, __: any, { user }: any) => {
            if (!user) throw new Error('Not authenticated');
            return await Task.findAll({ where: { userId: user.id } });
        },
        
        tasksPaginated: async (_: any, { input }: any,{ user }: any) => {
            if (!user) throw new Error('Not authenticated')
            const { first, after, orderBy = 'createdAt', orderDirection = 'DESC' } = input;
            const limit = Math.min(first, 100); // Prevent fetching too many items
            const order: [string, string][]= [[orderBy, orderDirection]]

            const where = {
                userId: user.id,
                ...(after && {
                    [orderBy]: {
                        [orderDirection === 'DESC' ? Op.lt : Op.gt]: new Date(atob(after))
                    }
                })
            };

            const tasks = await Task.findAll({
                where,
                limit: limit + 1, // Fetch one extra to check if there's more
                order,
            });

            const hasNextPage = tasks.length > limit;
            const edges = tasks.slice(0, limit).map(task => ({
                cursor: btoa(task[orderBy as TaskOrderBy].toString()),
                node: task,
            }));

            return {
                edges,
                pageInfo: {
                    hasNextPage,
                    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                },
                totalCount: await Task.count(),
            };
        },

        myTasksPaginated: async (_: any, { input }: any, { user }: any) => {
            if (!user) throw new Error('Not authenticated')

            const { first, after, orderBy = 'createdAt', orderDirection = 'DESC', search = "", status = "", } = input;
            const limit = Math.min(first, 100);
            const order: [string, string][] = [[orderBy, orderDirection]];

            const where: any = {
                userId: user.id,
                ...(after && {
                    [orderBy]: {
                        [orderDirection === 'DESC' ? Op.lt : Op.gt]: new Date(atob(after))
                    }
                }),
                ...(search && {
                    title: {
                        [Op.iLike]: `%${search}%` // Case-insensitive search
                    }
                }),
                ...(status !== "" && { // Only add status filter if not empty string
                    status: status
                })
            };

            const tasks = await Task.findAll({
                where,
                limit: limit + 1,
                order,
            });

            const hasNextPage = tasks.length > limit;
            const edges = tasks.slice(0, limit).map(task => ({
                cursor: btoa(task[orderBy as TaskOrderBy].toString()),
                node: task
            }))

            return {
                edges,
                pageInfo: {
                    hasNextPage,
                    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                },
                totalCount: await Task.count({ where: { userId: user.id } }),
            };
        },
        myTaskStatusCounts: async (_: any, __: any, { user }: any) => {
            if (!user) throw new Error('Not authenticated')

            const [todo, in_progress, done] = await Promise.all([
                Task.count({ where: { userId: user.id, status: 'todo' } }),
                Task.count({ where: { userId: user.id, status: 'in_progress' } }),
                Task.count({ where: { userId: user.id, status: 'done' } })
            ])

            return {
                todo,
                in_progress,
                done,
                total: todo + in_progress + done
            }
        }
    },

    Mutation: {
        createTask: async (_: any, { input }: any, { user }: any) => {
            if (!user) throw new Error('Not authenticated')
            return await Task.create({ ...input, userId: user.id })
        },
        updateTask: async (_: any, { id, input }: any, { user }: any) => {
            if (!user) throw new Error('Not authenticated')

            const task = await Task.findByPk(id)
            if (!task) throw new Error('Task not found')
            if (task.userId !== user.id) throw new Error('Not authorized')

            return await task.update(input)
        },
        deleteTask: async (_: any, { id }: { id: string }, { user }: any) => {
            if (!user) throw new Error('Not authenticated')

            const task = await Task.findByPk(id)
            if (!task) throw new Error('Task not found')
            if (task.userId !== user.id) throw new Error('Not authorized')

            await task.destroy()
            return true
        },
    },
}