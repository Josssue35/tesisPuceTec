import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/RegisterStyles.css';

const Register = () => {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validar que todos los campos estén llenos
        if (!cedula || !password || !fullName) {
            toast.error('Todos los campos son requeridos', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/usuarios/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cedula, password, full_name: fullName }),
            });

            const data = await response.json();

            if (response.status === 201) {
                toast.success('Registro exitoso', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
            } else {
                toast.error(data.error || 'Error en el registro', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            toast.error('Error en el servidor', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="auth-container">
            {/* Contenedor del video */}
            <div className="video-container">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                    <source
                        src="https://res.cloudinary.com/db88ukpit/video/upload/v1736043389/kosab6jvjpixtyu76jno.mp4"
                        type="video/mp4"
                    />
                    Tu navegador no soporta el elemento <code>video</code>.
                </video>
            </div>

            {/* Contenedor del formulario de registro */}
            <div className="form-container-modern">
                <h1 className="auth-title">Registro</h1>
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Campo: Cédula */}
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

                    {/* Campo: Contraseña */}
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

                    {/* Campo: Nombre completo */}
                    <div className="input-group">
                        <label htmlFor="fullName">Nombre completo</label>
                        <input
                            id="fullName"
                            type="text"
                            placeholder="Ingresa tu nombre completo"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    {/* Botón de registro */}
                    <button type="submit" className="auth-button">
                        Registrarse
                    </button>

                    {/* Enlace para ir al Login */}
                    <p className="auth-link">
                        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
                    </p>
                </form>
            </div>

            <ToastContainer />
        </div>
    );
};

export default Register;