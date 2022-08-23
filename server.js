const express = require('express');
const cors = require('cors');

const app = express();

require('dotenv').config();

// Define routes
app.use(cors());
app.get('/', (req, res) => {
  res.send({
    message: 'hello world this is me life should be fun for everyone (The Saddle Club)',
  });
});
app.use('/api/popular/tv', require('./routes/api/tv'));
app.use('/api/popular/streams', require('./routes/api/streams'));
app.use('/api/images', require('./routes/api/images'));
app.use('/api/details', require('./routes/api/details'));
app.use('/api/trending', require('./routes/api/trending'));
app.use('/api/upcoming', require('./routes/api/upcoming'));
app.use('/api/genre', require('./routes/api/genre'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
