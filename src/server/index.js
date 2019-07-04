import http from 'http';

import app from './app';

import keys from '../utils/config';

const { port } = keys;

const server = http.createServer(app);

server.listen(port, () => console.info(`Application running on port ${port}`));
