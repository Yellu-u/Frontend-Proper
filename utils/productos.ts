'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/api';

export type Producto = {
        id: number;
        imagen: string;
        nombre: string;
        categoria: string;
        descripcion: string;
        precio_descuento: number;
        precio_nuevo: number;
        stock?: number;
        enStock: boolean;
};

const IMAGEN_POR_DEFECTO = '/assets/img/logos/logocolor.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptarProducto(p: any, stock?: number): Producto {
        const precio = Number(p.precio ?? 0);
        const precioAnterior = Number(p.precioDescuento ?? p.precio_descuento ?? precio);
        const nombreLinea = p.linea?.nombre ?? p.linea?.lineaNombre ?? 'Sin categoría';

        return {
                id: p.productoId ?? p.id,
                imagen: p.imagen ?? IMAGEN_POR_DEFECTO,
                nombre: p.productoNombre ?? p.nombre ?? 'Producto',
                categoria: String(nombreLinea).replace(/^L[ií]nea\s+/i, ''),
                descripcion: p.descripcion ?? '',
                precio_descuento: precioAnterior,
                precio_nuevo: precio,
                stock,
                // si no se pudo leer el inventario, no se marca como agotado
                enStock: stock === undefined ? true : stock > 0,
        };
}

async function obtenerStock(): Promise<Map<number, number>> {
        const mapa = new Map<number, number>();
        try {
                const res = await apiFetch('/api/v1/inventario');
                if (!res.ok) return mapa;
                const data = await res.json();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data.forEach((i: any) => {
                        mapa.set(Number(i.productoId), Number(i.stockActual ?? 0));
                });
        } catch {
                // si falla el inventario, la tienda igual muestra los productos
        }
        return mapa;
}

async function obtenerStockDe(id: number): Promise<number | undefined> {
        try {
                const res = await apiFetch(`/api/v1/inventario/producto/${id}`);
                if (!res.ok) return undefined;
                const data = await res.json();
                const registro = Array.isArray(data) ? data[0] : data;
                return registro ? Number(registro.stockActual ?? 0) : undefined;
        } catch {
                return undefined;
        }
}

export async function obtenerProductos(): Promise<Producto[]> {
        const [resProductos, stock] = await Promise.all([
                apiFetch('/api/v1/productos'),
                obtenerStock(),
        ]);
        if (!resProductos.ok) throw new Error('No se pudieron cargar los productos');
        const data = await resProductos.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((p: any) => adaptarProducto(p, stock.get(Number(p.productoId ?? p.id))));
}

export async function obtenerProducto(id: number): Promise<Producto | null> {
        const [res, stock] = await Promise.all([
                apiFetch(`/api/v1/productos/${id}`),
                obtenerStockDe(id),
        ]);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('No se pudo cargar el producto');
        return adaptarProducto(await res.json(), stock);
}

export function useProductos() {
        const [productos, setProductos] = useState<Producto[]>([]);
        const [cargando, setCargando] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                let activo = true;
                obtenerProductos()
                        .then((lista) => { if (activo) setProductos(lista); })
                        .catch(() => { if (activo) setError('No se pudieron cargar los productos. Verifica que el servidor esté en ejecución.'); })
                        .finally(() => { if (activo) setCargando(false); });
                return () => { activo = false; };
        }, []);

        return { productos, cargando, error };
}

export function useProducto(id: number) {
        const [producto, setProducto] = useState<Producto | null>(null);
        const [cargando, setCargando] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                let activo = true;
                obtenerProducto(id)
                        .then((p) => { if (activo) setProducto(p); })
                        .catch(() => { if (activo) setError('No se pudo cargar el producto.'); })
                        .finally(() => { if (activo) setCargando(false); });
                return () => { activo = false; };
        }, [id]);

        return { productos: undefined, producto, cargando, error };
}