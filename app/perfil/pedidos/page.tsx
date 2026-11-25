'use client';

import { useState } from 'react';
import EstadoVacio from '@/components/EstadoVacio';

type Pedido = { codigo: string; fecha: string; total: number; estado: string };

export default function MisPedidosPage() {
    const [dias, setDias] = useState('30');
    const [busqueda, setBusqueda] = useState('');
    // TODO: cargar los pedidos desde el backend
    const [pedidos] = useState<Pedido[]>([]);

    const filtrados = pedidos.filter((p) =>
        p.codigo.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <>
        <h4 className="fw-bold mb-3">Mis pedidos</h4>

        <div className="perfil-box mb-4">
            <div className="row g-3">
            <div className="col-md-3">
                <label htmlFor="fecha" className="form-label fw-bold small">Fecha</label>
                <select id="fecha" className="form-select" value={dias} onChange={(e) => setDias(e.target.value)}>
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 3 meses</option>
                <option value="365">Último año</option>
                </select>
            </div>
            <div className="col-md-9">
                <label htmlFor="buscar" className="form-label fw-bold small">Buscar pedidos</label>
                <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                <input id="buscar" className="form-control" placeholder="Buscar por código"
                    value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                </div>
            </div>
            </div>
        </div>

        {filtrados.length === 0 ? (
            <EstadoVacio mensaje="No hay pedidos bajo estos filtros" />
        ) : (
            <div className="perfil-box table-responsive">
            <table className="table mb-0">
                <thead>
                <tr><th>Código</th><th>Fecha</th><th>Total</th><th>Estado</th></tr>
                </thead>
                <tbody>
                {filtrados.map((p) => (
                    <tr key={p.codigo}>
                    <td>{p.codigo}</td>
                    <td>{p.fecha}</td>
                    <td>${p.total.toLocaleString('es-CL')}</td>
                    <td>{p.estado}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </>
    );
}
