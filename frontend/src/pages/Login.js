import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AuthStyles.css';

const Login = () => {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cedula, password }),
            });
            const userData = await response.json();
            console.log(userData);
            if (response.status === 200) {
                console.log('Login successful:', userData);
                localStorage.setItem('userId', userData.id);
                localStorage.setItem('cedula', userData.cedula);
                localStorage.setItem('userRole', userData.role);
                localStorage.setItem('fullname', userData.fullname);

                navigate('/homepage');
            } else {
                toast.error('Nombre de usuario o contraseña incorrectos.', {
                    position: 'top-right',
                    autoClose: 3000,
                    className: 'custom-toast-error',
                });
            }
        } catch (error) {
            toast.error('Error en el inicio de sesión.', { position: 'top-right', autoClose: 3000 });
        }
    };

    return (
        <div className="auth-container">
            {/* Columna izquierda: Formulario de inicio de sesión */}
            <div className="form-container-modern">
                <h1>Iniciar Sesión</h1>
                <p>Bienvenido, por favor ingresa tus credenciales</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="cedula">Cédula</label>
                        <input
                            id="cedula"
                            type="text"
                            placeholder="Ingresa tu cédula"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button id="login" type="submit">
                        Inicia sesión
                    </button>
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => navigate('/register')}
                    >
                        Regístrate
                    </button>
                </form>
            </div>

            {/* Columna derecha: Video en loop */}
            <div className="video-container">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                    <source
                        src="https://res.cloudinary.com/db88ukpit/video/upload/v1735957908/xd9impudludr0saulbtu.mp4"
                        type="video/mp4"
                    />
                    Tu navegador no soporta el elemento <code>video</code>.
                </video>
            </div>

            <ToastContainer />
        </div>
    );
};

export default Login;