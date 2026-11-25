'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/app/globals.css'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

const enlaces = [
    { href: '/perfil', texto: 'Mi perfil', icono: 'bi-person' },
    { href: '/perfil/pedidos', texto: 'Mis pedidos', icono: 'bi-clipboard' },
    { href: '/perfil/direcciones', texto: 'Direcciones', icono: 'bi-geo-alt' },
];

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { sesion, cerrarSesion } = useAuth();
    const primerNombre = sesion?.nombreCompleto?.split(' ')[0] ?? 'Usuario';
    const inicial = primerNombre.charAt(0).toUpperCase();

    const handleCerrarSesion = () => {
    cerrarSesion();
    router.push('/home');
    };

    return (
    <div className="d-flex flex-column min-vh-100 login-wrapper">
        <Navbar />

        <main className="flex-grow-1">
            <div className="container py-4">
            <div className="row g-4">
                <aside className="col-md-3">
                <div className="perfil-sidebar">
                    <div className="perfil-sidebar-header">
                    <div className="perfil-avatar">{inicial}</div>
                    <span>Hola, {primerNombre}</span>
                    </div>
                    <nav className="perfil-nav">
                    {enlaces.map((e) => (
                        <Link
                        key={e.href}
                        href={e.href}
                        className={`perfil-link ${pathname === e.href ? 'activo' : ''}`}
                        >
                        <i className={`bi ${e.icono}`}></i>
                        {e.texto}
                        </Link>
                    ))}

                    <button type="button" className="perfil-link perfil-salir" onClick={handleCerrarSesion}>
                        <i className="bi bi-box-arrow-right"></i>
                        Cerrar sesión
                    </button>
                    </nav>
                </div>
                </aside>

                <section className="col-md-9 perfil-contenido">{children}</section>
            </div>
            </div>
        </main>

        <Footer />
        </div>
    );
}