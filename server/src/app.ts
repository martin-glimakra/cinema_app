/** @format */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import log from './middlewares/log';
import graphql from './graphql/graphql';
import auth from './middlewares/auth';
import admin from './admin';
import api from './api';

dotenv.config();
const app: express.Express = express();

app.use(cors());
app.use('*', log);
app.use('/graphql', graphql);
app.use('/api/users', api);
app.use('/api/admin', auth, admin);

app.listen(process.env.NODE_PORT, () =>
	console.log(
		`Server listening on ${process.env.NODE_HOST}:${process.env.NODE_PORT}`
	)
);
