const Book = require('../models/Book');

// GET /books - restituisce tutti i libri
exports.getAllBooks = async (req, res) => {
    try {
        const libri = await Book.find().sort({ createdAt: -1 });
        res.json(libri);
    } catch (err) {
        res.status(500).json({ messaggio: err.message });
    }
};

// GET /books/search?q=... - ricerca per titolo o autore
exports.searchBooks = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.json([]);
        }

        const libri = await Book.find({
            $or: [
                { titolo: { $regex: q, $options: 'i' } },
                { autore: { $regex: q, $options: 'i' } }
            ]
        });

        res.json(libri);
    } catch (err) {
        res.status(500).json({ messaggio: err.message });
    }
};

// GET /books/:id - restituisce un singolo libro
exports.getBook = async (req, res) => {
    try {
        const libro = await Book.findById(req.params.id);

        if (!libro) {
            return res.status(404).json({ messaggio: 'Libro non trovato' });
        }

        res.json(libro);
    } catch (err) {
        res.status(500).json({ messaggio: err.message });
    }
};

// POST /books - crea uno o più libri
exports.createBook = async (req, res) => {
    try {
        const data = req.body;

        // Gestione inserimento multiplo (array)
        if (Array.isArray(data)) {
            const savedBooks = await Book.insertMany(data);
            return res.status(201).json(savedBooks);
        }

        // Gestione inserimento singolo
        const newBook = new Book(data);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);

    } catch (err) {
        res.status(400).json({ messaggio: err.message });
    }
};

// PUT /books/:id - modifica un libro esistente
exports.updateBook = async (req, res) => {
    try {
        const libro = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!libro) {
            return res.status(404).json({ messaggio: 'Libro non trovato' });
        }

        res.json(libro);
    } catch (err) {
        res.status(400).json({ messaggio: err.message });
    }
};

// PATCH /books/add-pic - Aggiunge pic a libri che non l'hanno
exports.addDefaultPic = async (req, res) => {
    try {
        const { pic } = req.body;
        if (!pic) return res.status(400).json({ messaggio: 'Campo pic mancante' });

        const result = await Book.updateMany(
            { $or: [{ pic: { $exists: false } }, { pic: '' }] },
            { $set: { pic: pic } },
            { runValidators: true }
        );

        res.json({ messaggio: 'Pic aggiornate', modifiedCount: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ messaggio: err.message });
    }
};

// PATCH /books/:id/pic - Aggiorna pic singolo libro
exports.updateBookPic = async (req, res) => {
    try {
        const { pic } = req.body;
        const libro = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: { pic: pic } },
            { new: true, runValidators: true }
        );
        if (!libro) return res.status(404).json({ messaggio: 'Libro non trovato' });
        res.json(libro);
    } catch (err) {
        res.status(400).json({ messaggio: err.message });
    }
};

// PATCH /books/pics - Aggiorna più immagini
exports.updateManyPics = async (req, res) => {
    try {
        const updates = req.body;
        if (!Array.isArray(updates)) return res.status(400).json({ messaggio: 'Array richiesto' });

        const results = await Promise.all(updates.map(book => {
            const filter = book.id || book._id ? { _id: book.id || book._id } : { titolo: book.titolo };
            return Book.updateOne(filter, { $set: { pic: book.pic } }, { runValidators: true });
        }));
        res.json({ messaggio: 'Immagini aggiornate', results });
    } catch (err) {
        res.status(400).json({ messaggio: err.message });
    }
};

// PATCH /books/add-trama - Aggiunge trama di default
exports.addDefaultTrama = async (req, res) => {
    try {
        const { trama } = req.body;
        const result = await Book.updateMany(
            { $or: [{ trama: { $exists: false } }, { trama: '' }] },
            { $set: { trama: trama } },
            { runValidators: true }
        );
        res.json({ messaggio: 'Trame aggiornate', modifiedCount: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ messaggio: err.message });
    }
};

// PATCH /books/:id/trama - Aggiorna trama singolo
exports.updateBookTrama = async (req, res) => {
    try {
        const { trama } = req.body;
        const libro = await Book.findByIdAndUpdate(req.params.id, { $set: { trama: trama } }, { new: true });
        res.json(libro);
    } catch (err) {
        res.status(400).json({ messaggio: err.message });
    }
};

// PATCH /books/trame - Aggiorna più trame
exports.updateManyTrame = async (req, res) => {
    try {
        const updates = req.body;
        const results = await Promise.all(updates.map(book => {
            const filter = book.id || book._id ? { _id: book.id || book._id } : { titolo: book.titolo };
            return Book.updateOne(filter, { $set: { trama: book.trama } });
        }));
        res.json({ messaggio: 'Trame aggiornate', results });
    } catch (err) {
        res.status(400).json({ messaggio: err.message });
    }
};

// PATCH /books/dettagli - Aggiorna pic e trama insieme
exports.updateManyDetails = async (req, res) => {
    try {
        const updates = req.body;
        const results = await Promise.all(updates.map(book => {
            const fields = {};
            if (book.pic) fields.pic = book.pic;
            if (book.trama) fields.trama = book.trama;
            const filter = book.id || book._id ? { _id: book.id || book._id } : { titolo: book.titolo };
            return Book.updateOne(filter, { $set: fields });
        }));
        res.json({ messaggio: 'Dettagli aggiornati', results });
    } catch (err) {
        res.status(400).json({ messaggio: err.message });
    }
};

// DELETE /books/:id - elimina un libro
exports.deleteBook = async (req, res) => {
    try {
        const libro = await Book.findByIdAndDelete(req.params.id);
        if (!libro) return res.status(404).json({ messaggio: 'Libro non trovato' });
        res.json({ messaggio: 'Libro eliminato con successo' });
    } catch (err) {
        res.status(500).json({ messaggio: err.message });
    }
};