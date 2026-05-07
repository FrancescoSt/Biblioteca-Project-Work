import { useState, useEffect } from 'react';
import axios from 'axios';

function SearchBar({ onResults, onLoading }) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Aspetta 400ms dopo l'ultima digitazione prima di chiamare il backend
        const timer = setTimeout(async () => {
            if (searchTerm.trim() === '') {
                onResults(null); // null = torna a mostrare tutti i libri
                return;
            }

            try {
                onLoading(true);
                const res = await axios.get(`http://localhost:5175/books/search?q=${searchTerm}`);
                onResults(res.data);
            } catch (err) {
                console.error('Errore ricerca:', err);
            } finally {
                onLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer); // Cancella il timer se l'utente continua a scrivere
    }, [searchTerm]);

    return (
        <input
            type="text"
            className="form-control mb-4"
            placeholder="Cerca per titolo o autore..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    );
}

export default SearchBar;