import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import cors from "cors";
import { routes } from './src/routes';

const app = express();
const server = new http.Server(app)

// Setup API Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(routes);

// Setup Static Files
app.use(express.static(path.resolve('./src/upload')));


// Setup 404 Page
// app.use((req: Request, res: Response) => {
//     res.sendFile(path.resolve("public/404.html"))
// })

const PORT = 8088;
server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
});