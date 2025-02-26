import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/RegisterStyles.css';
import logo from '../resources/logoDelValle.png';

const Register = () => {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Elimina espacios al inicio y al final de cada campo
        const trimmedCedula = cedula.trim();
        const trimmedPassword = password.trim();
        const trimmedFullName = fullName.trim();

        // 1. Validar que todos los campos estén llenos
        if (!trimmedCedula || !trimmedPassword || !trimmedFullName) {
            toast.error('Todos los campos son requeridos', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        // 2. Validar cédula: mínimo 10 caracteres y solo números
        if (trimmedCedula.length < 10) {
            toast.error('La cédula debe tener al menos 10 caracteres', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        if (!/^\d+$/.test(trimmedCedula)) {
            toast.error('La cédula debe contener solo números', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        // 3. Validar nombre completo: mínimo 10 caracteres, solo letras y espacios
        if (trimmedFullName.length < 10) {
            toast.error('El nombre completo debe tener al menos 10 caracteres', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        if (!/^[a-zA-Z\s]+$/.test(trimmedFullName)) {
            toast.error('El nombre completo solo puede contener letras y espacios', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        // 4. Validar contraseña: mínimo 6 caracteres
        if (trimmedPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        // Si se pasa toda la validación, intenta registrar
        try {
            const response = await fetch('/api/usuarios/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cedula: trimmedCedula,
                    password: trimmedPassword,
                    full_name: trimmedFullName,
                }),
            });

            const data = await response.json();

            if (response.status === 201) {
                toast.success('Registro exitoso', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate('/login'); // Redirigir a la página de inicio de sesión
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
                <img
                    src={logo}
                    alt="Logo"
                    className="logo-image"
                />
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
                            onChange={(e) => {
                                const newValue = e.target.value;
                                if (/^\d*$/.test(newValue)) {
                                    setCedula(newValue);
                                }
                            }}
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
                            onChange={(e) => setFullName(e.target.value.toUpperCase())}
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
