import { Card, Button, ListGroup } from 'react-bootstrap';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/300x450?text=Copertina+non+disponibile';

// Converte le immagini OpenLibrary grandi (-L) in medie (-M), più leggere e veloci.
function getOptimizedImageUrl(url) {
    if (!url || url.trim() === '') return PLACEHOLDER_IMG;

    return url
        .trim()
        .replace('-L.jpg', '-M.jpg')
        .replace('-L.png', '-M.png');
}

function CardBook({ bookP, onHandleShow, onHandleDelete, onHandleEdit, isAdmin }) {
    return (
        <Card className="h-100 shadow-sm">
            <Card.Header as="h5" className="text-truncate">
                {bookP.titolo || 'Senza Titolo'}
            </Card.Header>

            <Card.Img
                variant="top"
                src={getOptimizedImageUrl(bookP.pic)}
                alt={`Copertina di ${bookP.titolo || 'libro'}`}
                className="book-cover"
                loading="lazy"
                decoding="async"
                width="180"
                height="250"
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PLACEHOLDER_IMG;
                }}
            />

            <Card.Body className="d-flex flex-column">
                <Card.Text>
                    <strong>{bookP.genere}</strong>
                    <br />
                    <small className="text-muted">Autore: {bookP.autore}</small>
                </Card.Text>

                <ListGroup variant="flush" className="my-2 flex-grow-1">
                    <ListGroup.Item>
                        <small>Anno: {bookP.annoPubblicazione}</small>
                    </ListGroup.Item>
                </ListGroup>

                <Button
                    onClick={() => onHandleShow(bookP)}
                    variant="primary"
                    className="w-100 mb-2"
                >
                    Trama
                </Button>

                {isAdmin && (
                    <div className="d-flex gap-2 mt-1">
                        <Button
                            variant="warning"
                            className="w-50"
                            onClick={() => onHandleEdit(bookP)}
                        >
                            ✏️ Modifica
                        </Button>

                        <Button
                            variant="danger"
                            className="w-50"
                            onClick={() => onHandleDelete(bookP._id)}
                        >
                            🗑️ Elimina
                        </Button>
                    </div>
                )}

                {bookP.website?.link && (
                    <Card.Link
                        href={bookP.website.link}
                        target="_blank"
                        className="text-center d-block mt-2"
                    >
                        {bookP.website.title || 'Sito Web'}
                    </Card.Link>
                )}
            </Card.Body>
        </Card>
    );
}

export default CardBook;