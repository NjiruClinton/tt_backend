import dotenv from 'dotenv';
import {createApp} from "./src/app";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        const {app} = await createApp();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/graphql`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();