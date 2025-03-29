import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export const generateToken = (user: User): string => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};