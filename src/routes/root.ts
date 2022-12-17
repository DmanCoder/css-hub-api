import express from 'express';
import discover from './api/discover';

const root = express.Router();

root.get('/', discover);

export default root;
