require('dotenv').config();

const mongoose = require('mongoose');
const Book = require('./models/Book');

const libri = [
    {
        titolo: 'Il nome della rosa',
        autore: 'Umberto Eco',
        annoPubblicazione: 1980,
        genere: 'Romanzo',
        pic: 'https://placehold.co/300x450?text=Il+nome+della+rosa'
    },
    {
        titolo: '1984',
        autore: 'George Orwell',
        annoPubblicazione: 1949,
        genere: 'Fantascienza',
        pic: 'https://placehold.co/300x450?text=1984'
    },
    {
        titolo: 'Sapiens',
        autore: 'Yuval Noah Harari',
        annoPubblicazione: 2011,
        genere: 'Saggistica',
        pic: 'https://placehold.co/300x450?text=Sapiens'
    },
    {
        titolo: 'Neuromante',
        autore: 'William Gibson',
        annoPubblicazione: 1984,
        genere: 'Fantascienza',
        pic: 'https://placehold.co/300x450?text=Neuromante'
    },
    {
        titolo: 'Il Signore degli Anelli',
        autore: 'J.R.R. Tolkien',
        annoPubblicazione: 1954,
        genere: 'Romanzo',
        pic: 'https://placehold.co/300x450?text=Il+Signore+degli+Anelli'
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Connesso al database...');

        await Book.deleteMany({});
        console.log('Collection svuotata');

        await Book.insertMany(libri);
        console.log(`Inseriti ${libri.length} libri!`);

        process.exit(0);
    } catch (err) {
        console.error('Errore:', err.message);
        process.exit(1);
    }
}

seed();