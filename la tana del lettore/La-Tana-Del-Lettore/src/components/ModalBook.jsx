import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const GENERI = [
    'Romanzo',
    'Romanzo fantascentifico',
    'Saggistica',
    'Fantascienza',
    'Storia',
    'Poesia',
    'Thriller',
    'Altro'
];

function ModalBook({ bookP, onHandleClick, isAdmin, onHandleSave }) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...bookP });

    useEffect(() => {
        setFormData({ ...bookP });
        setEditMode(false);
    }, [bookP]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onHandleSave(formData);
        setEditMode(false);
    };

    return (
        <Modal show={true} onHide={onHandleClick} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{bookP.titolo}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {editMode ? (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Titolo</Form.Label>
                            <Form.Control name="titolo" value={formData.titolo || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Autore</Form.Label>
                            <Form.Control name="autore" value={formData.autore || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Genere</Form.Label>
                            <Form.Select name="genere" value={formData.genere || ''} onChange={handleChange}>
                                {GENERI.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Anno Pubblicazione</Form.Label>
                            <Form.Control type="number" name="annoPubblicazione" value={formData.annoPubblicazione || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trama</Form.Label>
                            <Form.Control as="textarea" rows={4} name="trama" value={formData.trama || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Immagine (URL)</Form.Label>
                            <Form.Control name="pic" value={formData.pic || ''} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                ) : (
                    <p>{bookP.trama || 'Nessuna trama disponibile.'}</p>
                )}
            </Modal.Body>

            <Modal.Footer>
                {isAdmin && !editMode && (
                    <Button variant="warning" onClick={() => setEditMode(true)}>
                        ✏️ Modifica
                    </Button>
                )}
                {editMode && (
                    <>
                        <Button variant="success" onClick={handleSave}>💾 Salva</Button>
                        <Button variant="secondary" onClick={() => setEditMode(false)}>Annulla</Button>
                    </>
                )}
                <Button variant="secondary" onClick={onHandleClick}>Chiudi</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalBook;