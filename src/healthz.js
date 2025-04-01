import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ status: "OK" });
});

router.use((req, res) => {
    res.sendStatus(405);
});

export default router;