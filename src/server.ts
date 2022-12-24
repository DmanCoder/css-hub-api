import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

// Routes
import discover from './routes/api/discover';
import details from './routes/api/details';
import images from './routes/api/images';

const app = express();
dotenv.config();

// Apply middleware first
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Define routes
app.use('/api/discover', discover);
app.use('/api/details', details);
app.use('/api/images', images);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
