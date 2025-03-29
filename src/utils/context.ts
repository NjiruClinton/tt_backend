import { verify } from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function createContext({ req }: any) {
    const token = req.headers.authorization || '';

    try {
        if (!token) return { user: null };

        const decoded = verify(token.replace('Bearer ', ''), JWT_SECRET) as { id: number };
       const user = await User.findOne({ where: { id: decoded.id, deletedAt: null } })
        return { user };
    } catch (error) {
        return { user: null };
    }
}