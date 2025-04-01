import express from 'express';
import 'dotenv/config';
import axios from 'axios';

const port = process.env.PORT || 8080;
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        await axios.get(`http://localhost:${port}/healthz`);
        res.status(200).json({ status: "Ready" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Not Ready" });
    }
});

router.use((req, res) => {
    res.sendStatus(405);
});

export default router;