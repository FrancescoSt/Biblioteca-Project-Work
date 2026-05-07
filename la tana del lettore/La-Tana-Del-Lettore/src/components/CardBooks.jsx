import { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import CardBook from "./CardBook";
import ModalBook from "./ModalBook";

const GENERI = [
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
    'Fiaba filosofica',
    'Altro'
];

function CardBooks({ isAdmin }) {
    const [stars, setStars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const [newBook, setNewBook] = useState({
        titolo: '',
        autore: '',
        genere: 'Altro',
        annoPubblicazione: '',
        trama: '',
        pic: ''
    });

    useEffect(() => {
        let isMounted = true;

        async function fetchPosts() {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5000/books");

                if (isMounted) {
                    setStars(response.data);
                    setErr(null);
                }
            } catch (e) {
                if (isMounted) {
                    console.error("Errore fetch:", e);
                    setErr(e);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchPosts();

        return () => {
            isMounted = false;
        };
    }, [refresh]);

    const handleDelete = async (id) => {
        if (!window.confirm('Sei sicuro di voler eliminare questo libro?')) return;

        try {
            await axios.delete(`http://localhost:5000/books/${id}`);
            setRefresh(prev => prev + 1);
        } catch (e) {
            alert('Errore durante eliminazione: ' + e.message);
        }
    };

    const handleSave = async (bookData) => {
        try {
            const bookToSend = {
                ...bookData,
                annoPubblicazione: Number(bookData.annoPubblicazione)
            };

            await axios.put(`http://localhost:5000/books/${bookData._id}`, bookToSend);
            setSelectedBook(null);
            setRefresh(prev => prev + 1);
        } catch (e) {
            alert('Errore durante modifica: ' + e.message);
        }
    };

    const handleAddBook = async () => {
        try {
            const bookToSend = {
                ...newBook,
                annoPubblicazione: Number(newBook.annoPubblicazione)
            };

            await axios.post('http://localhost:5000/books', bookToSend);

            setNewBook({
                titolo: '',
                autore: '',
                genere: 'Altro',
                annoPubblicazione: '',
                trama: '',
                pic: ''
            });

            setShowAddForm(false);
            setRefresh(prev => prev + 1);
        } catch (e) {
            alert('Errore durante aggiunta: ' + e.message);
        }
    };

    function handleShow(book) {
        setSelectedBook(book);
    }

    function handleClose() {
        setSelectedBook(null);
    }

    if (loading) {
        return (
            <div className="text-center p-5">
                <h3>Caricamento libri...</h3>
            </div>
        );
    }

    if (err) {
        return (
            <div className="alert alert-danger">
                Errore di connessione al server: {err.message}
            </div>
        );
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const booksToShow = stars.filter(book => {
        const matchTitle =
            normalizedSearch === '' ||
            book.titolo?.toLowerCase().startsWith(normalizedSearch);

        const matchGenre =
            selectedGenre === '' ||
            book.genere === selectedGenre;

        return matchTitle && matchGenre;
    });

    return (
        <section>
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2>I Nostri Libri</h2>
                </Col>

                <Col className="text-end d-flex gap-2 justify-content-end">
                    {isAdmin && (
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            {showAddForm ? '✕ Annulla' : '➕ Aggiungi Libro'}
                        </Button>
                    )}

                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setRefresh(prev => prev + 1)}
                    >
                        🔄 Aggiorna Lista
                    </button>
                </Col>
            </Row>

            {isAdmin && showAddForm && (
                <Card className="mb-4 p-3 shadow-sm">
                    <h5>Aggiungi Nuovo Libro</h5>

                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Titolo</Form.Label>
                                    <Form.Control
                                        value={newBook.titolo}
                                        onChange={(e) =>
                                            setNewBook({ ...newBook, titolo: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Autore</Form.Label>
                                    <Form.Control
                                        value={newBook.autore}
                                        onChange={(e) =>
                                            setNewBook({ ...newBook, autore: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Genere</Form.Label>
                                    <Form.Select
                                        value={newBook.genere}
                                        onChange={(e) =>
                                            setNewBook({ ...newBook, genere: e.target.value })
                                        }
                                    >
                                        {GENERI.map(g => (
                                            <option key={g} value={g}>
                                                {g}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Anno Pubblicazione</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={newBook.annoPubblicazione}
                                        onChange={(e) =>
                                            setNewBook({
                                                ...newBook,
                                                annoPubblicazione: e.target.value
                                            })
                                        }
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Immagine (URL)</Form.Label>
                                    <Form.Control
                                        value={newBook.pic}
                                        onChange={(e) =>
                                            setNewBook({ ...newBook, pic: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Trama</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={newBook.trama}
                                        onChange={(e) =>
                                            setNewBook({ ...newBook, trama: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="success" onClick={handleAddBook}>
                            💾 Salva Libro
                        </Button>
                    </Form>
                </Card>
            )}

            <Row className="g-4">
                <Col lg={3}>
                    <aside className="filter-panel">
                        <h5>Filtra libri</h5>

                        <Form.Group className="mb-3">
                            <Form.Label>Cerca per titolo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Inizia a scrivere il titolo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Genere</Form.Label>
                            <Form.Select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                            >
                                <option value="">Tutti i generi</option>

                                {GENERI.map(g => (
                                    <option key={g} value={g}>
                                        {g}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <div className="filter-summary">
                            Libri visualizzati: <strong>{booksToShow.length}</strong>
                        </div>

                        <Button
                            variant="secondary"
                            className="w-100 mt-3"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedGenre('');
                            }}
                        >
                            Rimuovi filtri
                        </Button>
                    </aside>
                </Col>

                <Col lg={9}>
                    <Row xs={1} md={2} xl={3} className="g-4">
                        {booksToShow.length > 0 ? (
                            booksToShow.map((book, index) => (
                                <Col key={book._id || index}>
                                    <CardBook
                                        bookP={book}
                                        onHandleShow={handleShow}
                                        onHandleDelete={handleDelete}
                                        onHandleEdit={handleShow}
                                        isAdmin={isAdmin}
                                    />
                                </Col>
                            ))
                        ) : (
                            <Col xs={12}>
                                <p>
                                    {searchTerm || selectedGenre
                                        ? 'Nessun libro trovato con i filtri selezionati.'
                                        : 'Nessun libro trovato nel database.'}
                                </p>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>

            {selectedBook && (
                <ModalBook
                    bookP={selectedBook}
                    onHandleClick={handleClose}
                    isAdmin={isAdmin}
                    onHandleSave={handleSave}
                />
            )}
        </section>
    );
}

export default CardBooks;