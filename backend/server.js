const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Autoriser CORS
app.use(cors({
  origin: 'http://localhost:4200', // Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Routes
const articleRoutes = require('./routes/articles');
app.use('/articles', articleRoutes);

app.listen(5000, () => {
  console.log('Serveur démarré sur http://localhost:5000');
});
