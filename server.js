import express from 'express';
import cors from 'cors';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// db 
import { db } from "./firebase.js"

// GET route to retrieve all data
app.get('/data', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "userData"));
        const data = querySnapshot.docs.map((doc, idx) => { return { ...doc.data(), no: idx + 1 } });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST route to save data
app.post('/save', async (req, res) => {
    try {
        const { name, age, email, batch } = req.body;

        if (!name || !age || !email || !batch) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const userData = { name, age, email, batch };
        const ref = await addDoc(collection(db, "userData"), userData);
        res.json({ message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
