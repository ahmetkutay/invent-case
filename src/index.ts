import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { config } from './config/config';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => errorHandler(err, req, res, next)) as unknown as express.ErrorRequestHandler);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});

export default app;