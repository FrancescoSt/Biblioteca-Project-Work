require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5175',

    ]
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connesso!'))
    .catch(err => console.error('Errore DB:', err.message));

// Rotte
// Rotte
app.use('/auth', require('./routes/auth'));  // ← NUOVO
app.use('/books', require('./routes/books'));

app.listen(process.env.PORT, () => {
    console.log(`Server su http://localhost:${process.env.PORT}`);
});