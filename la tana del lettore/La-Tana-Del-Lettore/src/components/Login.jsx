import { useState } from 'react';
import { useAuth } from '../components/AuthContext';

function Login({ onClose }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState(null);

    const handleSubmit = async () => {
        try {
            await login(username, password);
            onClose();
        } catch {
            setErr('Accesso consentito solo agli amministratori oppure password errata.');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <center>
                <h2>Accedi come Admin</h2>
            </center>
            {err && <div className="alert alert-danger">{err}</div>}
            <input
                className="form-control mb-3"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={handleSubmit}>
                Accedi
            </button>
            <button className="btn btn-link w-100 mt-2" onClick={onClose}>
                Annulla
            </button>
        </div>
    );
}

export default Login;