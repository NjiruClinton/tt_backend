import User from "../models/User";

export const validateSignupInput = (
    firstName: string,
    lastName: string,
    email: string,
    password: string
): void => {
    if (!firstName || !lastName || !email || !password) {
        throw new Error('All fields are required');
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
};

export const checkIfUserExists = async (email: string): Promise<void> => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
};