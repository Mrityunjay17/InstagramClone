import { Router } from 'express';
import user from './controller/user/routes';

const routes = Router();

routes.use('/user', user);

// setup 404
routes.use('*', (req, res) => {
    res.send({ status: 404, message: 'Not Found', env: process.env });
});

export default routes;
