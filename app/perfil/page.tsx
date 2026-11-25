'use client';

import { useState } from 'react';
import { validarCorreo, validarContrasena } from '@/utils/validaciones';

// Datos de ejemplo: luego los reemplazas por los que vengan de tu backend
const datosIniciales = {
    nombre: 'Benjamin Perez',
    correo: 'benjamin@gmail.com',
    telefono: '+56912345678',
    nacimiento: '2003-09-26',
    genero: 'Masculino',
    rut: '12.345.678-9',
};

export default function MiPerfilPage() {
    const [datos, setDatos] = useState(datosIniciales);
    const [editandoDatos, setEditandoDatos] = useState(false);

    const [contrasena, setContrasena] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [editandoClave, setEditandoClave] = useState(false);

    const cambiar = (campo: keyof typeof datos, valor: string) =>
        setDatos({ ...datos, [campo]: valor });

    const guardarDatos = () => {
        if (!validarCorreo(datos.correo)) {
        alert('El correo debe ser un @gmail.com o un @duoc.cl y tener máximo 100 caracteres');
        return;
        }
        // TODO: enviar al backend con fetch(`${API_URL}/...`)
        setEditandoDatos(false);
    };

    const guardarClave = () => {
        if (!validarContrasena(contrasena)) {
        alert('La contraseña debe tener entre 4 y 10 caracteres');
        return;
        }
        if (contrasena !== confirmar) {
        alert('Las contraseñas no coinciden');
        return;
        }
        // TODO: enviar al backend
        setContrasena('');
        setConfirmar('');
        setEditandoClave(false);
    };

    return (
        <>
        {/* DATOS PERSONALES */}
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
                value={datos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
            </div>
            <div className="mb-3">
            <label htmlFor="correo" className="form-label fw-bold small">Correo</label>
            <input id="correo" type="email" className="form-control" disabled={!editandoDatos}
                value={datos.correo} onChange={(e) => cambiar('correo', e.target.value)} />
            </div>
            <div className="mb-3">
            <label htmlFor="telefono" className="form-label fw-bold small">Teléfono</label>
            <input id="telefono" className="form-control" disabled={!editandoDatos}
                value={datos.telefono} onChange={(e) => cambiar('telefono', e.target.value)} />
            </div>
            <div className="mb-3">
            <label htmlFor="nacimiento" className="form-label fw-bold small">Fecha de nacimiento</label>
            <input id="nacimiento" type="date" className="form-control" disabled={!editandoDatos}
                value={datos.nacimiento} onChange={(e) => cambiar('nacimiento', e.target.value)} />
            </div>
            <div className="mb-3">
            <label htmlFor="genero" className="form-label fw-bold small">Género</label>
            <select id="genero" className="form-select" disabled={!editandoDatos}
                value={datos.genero} onChange={(e) => cambiar('genero', e.target.value)}>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
            </select>
            </div>
            <div>
            <label htmlFor="rut" className="form-label fw-bold small">RUT</label>
            <input id="rut" className="form-control" disabled={!editandoDatos}
                value={datos.rut} onChange={(e) => cambiar('rut', e.target.value)} />
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
