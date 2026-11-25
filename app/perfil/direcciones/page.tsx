'use client';

import { useState } from 'react';
import EstadoVacio from '@/components/EstadoVacio';

type Direccion = { calle: string; comuna: string; ciudad: string };

export default function DireccionesPage() {
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [formAbierto, setFormAbierto] = useState(false);
    const [nueva, setNueva] = useState<Direccion>({ calle: '', comuna: '', ciudad: '' });

    const agregar = (event: React.SyntheticEvent) => {
        event.preventDefault();
        // TODO: guardar en el backend
        setDirecciones([...direcciones, nueva]);
        setNueva({ calle: '', comuna: '', ciudad: '' });
        setFormAbierto(false);
    };

    const eliminar = (indice: number) =>
        setDirecciones(direcciones.filter((_, i) => i !== indice));

    return (
        <>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Direcciones</h4>
            <button className="btn btn-negro" onClick={() => setFormAbierto(!formAbierto)}>
            <i className="bi bi-plus me-1"></i>Añadir dirección
            </button>
        </div>

        {formAbierto && (
            <form className="perfil-box mb-4" onSubmit={agregar}>
            <div className="row g-3">
                <div className="col-md-12">
                <label htmlFor="calle" className="form-label fw-bold small">Calle y número</label>
                <input id="calle" className="form-control" required
                    value={nueva.calle} onChange={(e) => setNueva({ ...nueva, calle: e.target.value })} />
                </div>
                <div className="col-md-6">
                <label htmlFor="comuna" className="form-label fw-bold small">Comuna</label>
                <input id="comuna" className="form-control" required
                    value={nueva.comuna} onChange={(e) => setNueva({ ...nueva, comuna: e.target.value })} />
                </div>
                <div className="col-md-6">
                <label htmlFor="ciudad" className="form-label fw-bold small">Ciudad</label>
                <input id="ciudad" className="form-control" required
                    value={nueva.ciudad} onChange={(e) => setNueva({ ...nueva, ciudad: e.target.value })} />
                </div>
            </div>
            <button type="submit" className="btn btn-negro mt-3">Guardar dirección</button>
            </form>
        )}

        {direcciones.length === 0 ? (
            <EstadoVacio mensaje="Aún no has agregado direcciones" />
        ) : (
            <div className="d-flex flex-column gap-3">
            {direcciones.map((d, i) => (
                <div key={i} className="perfil-box d-flex justify-content-between align-items-center">
                <div>
                    <p className="fw-bold mb-0">{d.calle}</p>
                    <p className="text-muted small mb-0">{d.comuna}, {d.ciudad}</p>
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={() => eliminar(i)}>Eliminar</button>
                </div>
            ))}
            </div>
        )}
        </>
    );
}
