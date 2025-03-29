import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../../models/User";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authResolvers = {
    Query: {
        me: async (_: any, __: any, { user }: any) => {
            if (!user) throw new Error('Not authenticated');
            return await User.findByPk(user.id);
        },
    },

    Mutation: {
        signup: async (_: any, { input }: any) => {
            const { firstName, lastName, email, password } = input;

            // Basic validation
            if (!firstName || !lastName || !email || !password) {
                throw new Error('All fields are required');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('Email already in use');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
                expiresIn: '1h',
            });

            return { token, user };
        },

        login: async (_: any, { input }: any) => {
            const { email, password } = input;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error('Invalid credentials');
            }

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
                expiresIn: '1h',
            });

            return { token, user };
        },

        updateUser: async (_: any, { input }: any, { user }: any) => {
            if (!user) throw new Error('Not authenticated')

            const currentUser = await User.findByPk(user.id);
            if (!currentUser) throw new Error('User not found')

            // Prevent email duplication
            if (input.email && input.email !== currentUser.email) {
                const emailExists = await User.findOne({ where: { email: input.email } })
                if (emailExists) throw new Error('Email already in use')
            }

            return await currentUser.update(input)
        },

        deleteUser: async (_: any, __: any, { user }: any) => {
            if (!user) throw new Error('Not authenticated')

            const currentUser = await User.findByPk(user.id)
            if (!currentUser) throw new Error('User not found')

            // Soft delete (sets deletedAt timestamp)
            await currentUser.destroy();

            return true;
        },

        // changePassword: async (_: any, { currentPassword, newPassword }: any, { user }: any) => {
        //     if (!user) throw new Error('Not authenticated');
        //
        //     const currentUser = await User.findByPk(user.id);
        //     if (!currentUser) throw new Error('User not found');
        //
        //     const valid = await bcrypt.compare(currentPassword, currentUser.password);
        //     if (!valid) throw new Error('Current password is incorrect');
        //
        //     currentUser.password = await bcrypt.hash(newPassword, 10);
        //     await currentUser.save();
        //
        //     return true;
        // },
        // restoreUser: async (_: any, { userId }: any, { user, isAdmin }: any) => {
        //     if (!isAdmin) throw new Error('Not authorized');
        //
        //     const userToRestore = await User.findByPk(userId, { paranoid: false });
        //     if (!userToRestore) throw new Error('User not found');
        //
        //     await userToRestore.restore();
        //     return true;
        // }
        
    },
};