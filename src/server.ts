import express from 'express';
import cors from 'cors';

// Routes
import discover from './routes/api/discover';

const app = express();

// Apply middleware first
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Define routes
app.use('/api/discover', discover);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
