import { Router } from 'express';

const routes = Router();

routes.use('*', (req, res) => {
    res.send({ status: 404, message: 'Not Found' });
});

export default routes;
