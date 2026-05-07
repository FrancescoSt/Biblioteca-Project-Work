const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    titolo: {
        type: String,
        required: [true, 'Il titolo e obbligatorio'],
        trim: true
    },
    autore: {
        type: String,
        required: [true, 'L autore e obbligatorio'],
        trim: true
    },
    annoPubblicazione: {
        type: Number,
        min: 1000,
        max: new Date().getFullYear()
    },
genere: {
    type: String,
    enum: [
        'Romanzo',
        'Romanzo fantascientifico',
        'Saggistica',
        'Fantascienza',
        'Fantasy',
        'Horror',
        'Giallo',
        'Thriller',
        'Avventura',
        'Azione',
        'Storia',
        'Biografia',
        'Autobiografia',
        'Poesia',
        'Teatro',
        'Filosofia',
        'Psicologia',
        'Religione',
        'Scienza',
        'Tecnologia',
        'Informatica',
        'Economia',
        'Politica',
        'Educazione',
        'Manuale',
        'Fumetto',
        'Manga',
        'Graphic novel',
        'Distopico',
        'Romantico',
        'Classico',
        'Umoristico',
        'Crime',
        'Noir',
        'Fiaba filosofica'
    ],
    default: 'Altro'
},

    // Link dell'immagine/copertina del libro
    pic: {
        type: String,
        default: '',
        trim: true
    },
    
        trama: {
        type: String,
        default: '',
        trim: true
    },


    disponibile: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);