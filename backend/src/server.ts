import express from 'express';
import './database/connection';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import 'express-async-errors';
import errorHandler from './errors/handler';
import https from 'https';
import fs from 'fs';

const app = express();

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '..', 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'cert', 'cert.pem')),
}, app);

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler);

sslServer.listen(3333, ()=>{
    console.log('Secure Server Teste');
});