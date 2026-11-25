'use client';

import Link from 'next/link';
import { useCarrito } from '@/app/context/CarritoContext';
import { useAuth } from '@/app/context/AuthContext';

export default function Navbar() {
        const { carrito } = useCarrito();
        const { sesion, cargando, tieneRol } = useAuth();

        let totalProductos = 0;
        if (carrito) {
                for (let i = 0; i < carrito.length; i++) {
                        totalProductos = totalProductos + carrito[i].cantidad;
                }
        }

        const esAdmin = tieneRol('ADMINISTRADOR');
        const esVendedor = tieneRol('VENDEDOR') && !esAdmin;

        // Muestra el primer nombre; si no hay nombre completo, el usuario (correo)
        const nombreVisible = sesion?.nombreCompleto
                ? sesion.nombreCompleto.split(' ')[0]
                : sesion?.nombreUsuario;

        return (
                <nav className="navbar navbar-expand-sm navbar-proper shadow-sm">
                        <div className="container-fluid px-4">
                                <div className="navbar-header">
                                        <img id="logo-color-img-nav" src="/assets/img/logos/logocolor.png" alt="logo-proper-color" />
                                </div>

                                {/* MENÚ CENTRAL */}
                                <ul className="navbar-nav mx-auto">
                                        {esVendedor ? (
                                                <>
                                                        <li className="nav-item"><Link className="nav-link fw-semibold" href="/vendedor/productos">Productos</Link></li>
                                                        <li className="nav-item"><Link className="nav-link fw-semibold" href="/vendedor/ordenes">Órdenes</Link></li>
                                                </>
                                        ) : (
                                                <>
                                                        <li className="nav-item"><Link className="nav-link fw-semibold" href="/home">Home</Link></li>
                                                        <li className="nav-item"><Link className="nav-link fw-semibold" href="/productos">Productos</Link></li>
                                                        <li className="nav-item"><Link className="nav-link fw-semibold" href="/nosotros">Nosotros</Link></li>
                                                        <li className="nav-item"><Link className="nav-link fw-semibold" href="/contacto">Contacto</Link></li>
                                                        <li className="nav-item"><Link className="nav-link fw-semibold" href="/blog">Blogs</Link></li>
                                                </>
                                        )}
                                        {esAdmin && (
                                                <li className="nav-item"><Link className="nav-link fw-semibold" href="/admin">Administración</Link></li>
                                        )}
                                </ul>

                                {/* LADO DERECHO: CARRITO Y CUENTA */}
                                <ul className="nav navbar-nav navbar-right">
                                        {!esVendedor && (
                                                <li>
                                                        <Link href="/carrito" className="nav-link text-white fw-bold">
                                                                Carrito
                                                                {totalProductos > 0 && (
                                                                        <span className="badge bg-danger rounded-pill">
                                                                                {totalProductos}
                                                                        </span>
                                                                )}
                                                        </Link>
                                                </li>
                                        )}

                                        {/* Mientras se lee la sesión guardada no se muestra nada, para evitar parpadeos */}
                                        {!cargando && (
                                                <li>
                                                        {sesion ? (
                                                                <Link href="/perfil" className="nav-link text-white fw-bold">
                                                                        Hola, {nombreVisible}
                                                                </Link>
                                                        ) : (
                                                                <Link href="/iniciar-sesion" className="nav-link text-white fw-bold">
                                                                        Iniciar sesión
                                                                </Link>
                                                        )}
                                                </li>
                                        )}
                                </ul>
                        </div>
                </nav>
        );
}