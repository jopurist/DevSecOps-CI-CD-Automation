import 'dotenv/config';
import express from 'express';
import healthz from './src/healthz.js';
import readyz from './src/readyz.js';
import request from './src/request.js';

const app = express();
// app.disable('x-powered-by');
const port = process.env.PORT || 8080;

app.use('/healthz', healthz);
app.use('/readyz', readyz);
app.use('/request', request);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;

