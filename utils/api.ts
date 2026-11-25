export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9090';

export type Sesion = {
        token: string;
        nombreUsuario: string;
        roles: string[];
};

const CLAVE_SESION = 'sesion';

export function leerSesion(): Sesion | null {
        if (typeof window === 'undefined') return null;
        try {
                const guardada = localStorage.getItem(CLAVE_SESION);
                return guardada ? (JSON.parse(guardada) as Sesion) : null;
        } catch {
                return null;
        }
}

export function guardarSesion(sesion: Sesion) {
        localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function borrarSesion() {
        localStorage.removeItem(CLAVE_SESION);
}

// fetch hacia el gateway, agregando el token automáticamente si existe
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
        const sesion = leerSesion();
        const headers = new Headers(options.headers);

        if (options.body && !headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
        }
        if (sesion?.token) {
                headers.set('Authorization', `Bearer ${sesion.token}`);
        }

        return fetch(`${API_URL}${path}`, { ...options, headers });
}