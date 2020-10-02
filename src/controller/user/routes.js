// add all the routes
import { Router } from 'express';

const router = new Router();

router
    .route('/login')
    .post((req, res) => {
        res.send('hello');
    })
    .get((req, res) => {
        res.send('user');
    });

export default router;
