import { Router } from 'express';
import user from './controller/user/routes';

const routes = Router();

routes.use('/user', user);
routes.use('*', (req, res) => {
    res.send({ status: 404, message: 'Not Found' });
    console.log(process.env);
});

export default routes;
