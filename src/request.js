import express from 'express';

const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
    console.log('bodyParser: ', req.body);
    res.status(200).json(req.body);
});

router.put('/', (req, res) => {
   console.log('Hello, World');
   res.status(200)
});

router.use((req, res) => {
    res.sendStatus(405);
});

export default router;