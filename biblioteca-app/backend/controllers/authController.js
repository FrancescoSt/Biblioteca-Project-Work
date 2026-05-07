const jwt = require('jsonwebtoken');

const ADMIN = {
    username: 'admin',
    password: 'v9K#rT2!mQ7zL@5xP$8nY3wF&cA6s'
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (username !== ADMIN.username || password !== ADMIN.password) {
        return res.status(401).json({ messaggio: 'Credenziali errate' });
    }

    const token = jwt.sign(
        { username: 'admin', ruolo: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({ token });
};