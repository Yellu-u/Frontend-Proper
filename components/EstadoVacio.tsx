export default function EstadoVacio({ mensaje }: { mensaje: string }) {
    return (
        <div className="estado-vacio">
        <i className="bi bi-info-circle d-block mb-2"></i>
        <p className="fw-semibold mb-0">{mensaje}</p>
        </div>
    );
}
