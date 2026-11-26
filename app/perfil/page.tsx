'use client';

import { useEffect, useState } from 'react';
import { validarCorreo, validarContrasena } from '@/utils/validaciones';
import { API_URL } from '@/utils/api';
import { useAuth } from '@/app/context/AuthContext';

export default function MiPerfilPage() {
    const { sesion, iniciarSesion } = useAuth();

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [editandoDatos, setEditandoDatos] = useState(false);

    const [contrasena, setContrasena] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [editandoClave, setEditandoClave] = useState(false);

    {/*Rellena con los datos de la sesión*/}
    useEffect(() => {
        if (!sesion) return;
        setNombre(sesion.nombreCompleto ?? '');
        setCorreo(sesion.nombreUsuario ?? '');
    }, [sesion]);

    const guardarDatos = async () => {
        if (!sesion) return;

        if (!validarCorreo(correo)) {
            alert('El correo debe ser un @gmail.com o un @duoc.cl y tener máximo 100 caracteres');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/perfil`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sesion.token}`,
                },
                body: JSON.stringify({ nombreCompleto: nombre, correo }),
            });

            if (res.status === 401) {
                alert('Tu sesión expiró. Vuelve a iniciar sesión.');
                return;
            }
            if (!res.ok) {
                alert(await res.text());
                return;
            }

            const data = await res.json();

            // Actualiza la sesión para que el menú y la página muestren lo nuevo
            iniciarSesion({
                ...sesion,
                token: data.token,
                nombreCompleto: data.nombreCompleto,
                nombreUsuario: data.nombreUsuario,
            });

            setEditandoDatos(false);
        } catch {
            alert('No se pudo conectar con el servidor. Verifica que el gateway esté en ejecución.');
        }
    };

    const guardarClave = async () => {
        if (!sesion) return;

        if (!validarContrasena(contrasena)) {
            alert('La contraseña debe tener entre 4 y 10 caracteres');
            return;
        }
        if (contrasena !== confirmar) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/perfil/contrasena`, {  
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sesion.token}`,
                },
                body: JSON.stringify({ contrasena }),
            });

            if (res.status === 401) {
                alert('Tu sesión expiró. Vuelve a iniciar sesión.');
                return;
            }
            if (!res.ok) {
                alert('No se pudo cambiar la contraseña');
                return;
            }

            setContrasena('');
            setConfirmar('');
            setEditandoClave(false);
            alert('Contraseña actualizada');
        } catch {
            alert('No se pudo conectar con el servidor.');
        }
    };

    return (
        <>
        {/* DATOS DE LA CUENTA */}
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Mi perfil</h4>
            <button
            className="btn btn-negro"
            onClick={() => (editandoDatos ? guardarDatos() : setEditandoDatos(true))}
            >
            {editandoDatos ? 'Guardar' : 'Editar'}
            </button>
        </div>

        <div className="perfil-box mb-4">
            <div className="mb-3">
            <label htmlFor="nombre" className="form-label fw-bold small">Nombre</label>
            <input id="nombre" className="form-control" disabled={!editandoDatos}
                value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div>
            <label htmlFor="correo" className="form-label fw-bold small">Correo</label>
            <input id="correo" type="email" className="form-control" disabled={!editandoDatos}
                value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </div>
        </div>

        {/* CONTRASEÑA */}
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Contraseña</h4>
            <button
            className="btn btn-negro"
            onClick={() => (editandoClave ? guardarClave() : setEditandoClave(true))}
            >
            {editandoClave ? 'Guardar' : 'Editar'}
            </button>
        </div>

        <div className="perfil-box">
            <div className="mb-3">
            <label htmlFor="clave" className="form-label fw-bold small">Nueva contraseña</label>
            <input id="clave" type="password" className="form-control" disabled={!editandoClave}
                value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
            </div>
            <div>
            <label htmlFor="confirmar" className="form-label fw-bold small">Confirmar nueva contraseña</label>
            <input id="confirmar" type="password" className="form-control" disabled={!editandoClave}
                value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
            </div>
        </div>
        </>
    );
}