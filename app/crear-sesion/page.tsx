'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { validarRegistro } from '@/utils/validaciones';
import { API_URL } from '@/utils/api';

export default function RegistroPage() {
        const [nombre, setNombre] = useState('');
        const [correo, setCorreo] = useState('');
        const [contrasena, setContrasena] = useState('');
        const [confirmarContrasena, setConfirmarContrasena] = useState('');
        const [enviando, setEnviando] = useState(false);
        const router = useRouter();

        const handleSubmit = async (event: React.SyntheticEvent) => {
                event.preventDefault();

                if (!validarRegistro(nombre, correo, contrasena, confirmarContrasena)) {
                        alert("Revisa los datos. Asegúrate de que el correo sea válido, la contraseña tenga entre 4 y 10 caracteres, y que ambas contraseñas coincidan.");
                        return;
                }

                setEnviando(true);
                try {
                        const res = await fetch(`${API_URL}/auth/registrar`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                        nombreUsuario: correo,
                                        correo: correo,
                                        contrasena: contrasena,
                                }),
                        });

                        if (res.status === 409) {
                                alert(await res.text());
                                return;
                        }

                        if (!res.ok) {
                                alert("No se pudo completar el registro. Intenta nuevamente.");
                                return;
                        }

                        alert("¡Usuario registrado con éxito! Ahora puedes iniciar sesión.");
                        router.push('/iniciar-sesion');
                } catch {
                        alert("No se pudo conectar con el servidor. Verifica que el gateway esté en ejecución.");
                } finally {
                        setEnviando(false);
                }
        };

        return (
                <div className="login-wrapper">

                        {/* NAVBAR */}
                        <Navbar />

                        {/* CONTENEDOR PRINCIPAL */}
                        <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">

                                {/* TARJETA DEL FORMULARIO */}
                                <div className="card shadow-lg border-0 p-5 login-card" style={{ maxWidth: '500px' }}>

                                        <div className="text-center mb-4">
                                                <img src="/assets/img/logos/logo.png" alt="Logo Proper" className="d-block mx-auto mb-4 login-logo" />
                                                <h3 className="fw-bold text-proper">Crear Cuenta</h3>
                                                <p className="text-muted small">Únete a ProperChile para gestionar tus compras</p>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                        <label htmlFor="nombre" className="form-label fw-bold text-proper small">NOMBRE COMPLETO</label>
                                                        <input
                                                                type="text"
                                                                className="form-control form-control-lg bg-light"
                                                                id="nombre"
                                                                placeholder="Ej: Juan Pérez"
                                                                required
                                                                value={nombre}
                                                                onChange={(e) => setNombre(e.target.value)}
                                                        />
                                                </div>

                                                <div className="mb-3">
                                                        <label htmlFor="correo" className="form-label fw-bold text-proper small">CORREO ELECTRÓNICO</label>
                                                        <input
                                                                type="email"
                                                                className="form-control form-control-lg bg-light"
                                                                id="correo"
                                                                placeholder="juan@ejemplo.com"
                                                                required
                                                                value={correo}
                                                                onChange={(e) => setCorreo(e.target.value)}
                                                        />
                                                </div>

                                                <div className="mb-3">
                                                        <label htmlFor="contrasena" className="form-label fw-bold text-proper small">CONTRASEÑA</label>
                                                        <input
                                                                type="password"
                                                                className="form-control form-control-lg bg-light"
                                                                id="contrasena"
                                                                placeholder="Mínimo 4 caracteres"
                                                                required
                                                                value={contrasena}
                                                                onChange={(e) => setContrasena(e.target.value)}
                                                        />
                                                </div>

                                                <div className="mb-4">
                                                        <label htmlFor="confirmarContrasena" className="form-label fw-bold text-proper small">CONFIRMAR CONTRASEÑA</label>
                                                        <input
                                                                type="password"
                                                                className="form-control form-control-lg bg-light"
                                                                id="confirmarContrasena"
                                                                placeholder="Repite tu contraseña"
                                                                required
                                                                value={confirmarContrasena}
                                                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                                        />
                                                </div>

                                                <button type="submit" className="btn btn-lg btn-proper w-100 mb-4" disabled={enviando}>
                                                        {enviando ? 'Registrando...' : 'Registrarse'}
                                                </button>

                                                <div className="text-center">
                                                        <span className="text-muted small">¿Ya tienes cuenta? </span>
                                                        <Link href="/iniciar-sesion" className="text-decoration-none fw-bold text-proper small">
                                                                Inicia sesión aquí
                                                        </Link>
                                                </div>
                                        </form>
                                </div>
                        </div>
                </div>
        );
}