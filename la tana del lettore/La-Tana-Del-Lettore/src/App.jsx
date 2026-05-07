import { useState } from 'react';
import CardBooks from './components/CardBooks';
import Login from './components/Login';
import { AuthProvider, useAuth } from './components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function AppContent() {
    const { token, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="container" style={{ background: 'white', minHeight: '100vh', padding: '20px' }}>
            <header className="text-center mb-5">
                <h1 className="display-4">La Tana del Lettore</h1>
                <p className="lead">Francesco Adrian Stoppa & Giovanni Brescia Project Work</p>

                {/* Bottone login/logout in alto a destra */}
                <div className="position-absolute top-0 end-0 m-3">
                    {token ? (
                        <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                            Logout Admin
                        </button>
                    ) : (
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setShowLogin(true)}>
                            Accedi
                        </button>
                    )}
                </div>
            </header>

            {/* Mostra il form di login se richiesto */}
            {showLogin && !token && (
                <Login onClose={() => setShowLogin(false)} />
            )}

            {/* Passa isAdmin a CardBooks */}
            <CardBooks isAdmin={!!token} />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;