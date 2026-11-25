'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Sesion, leerSesion, guardarSesion, borrarSesion } from '@/utils/api';

type AuthContextType = {
        sesion: Sesion | null;
        cargando: boolean;
        iniciarSesion: (sesion: Sesion) => void;
        cerrarSesion: () => void;
        tieneRol: (rol: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
        const [sesion, setSesion] = useState<Sesion | null>(null);
        const [cargando, setCargando] = useState(true);

        // Al cargar la página, recuperar la sesión guardada
        useEffect(() => {
                setSesion(leerSesion());
                setCargando(false);
        }, []);

        const iniciarSesion = (nueva: Sesion) => {
                guardarSesion(nueva);
                setSesion(nueva);
        };

        const cerrarSesion = () => {
                borrarSesion();
                setSesion(null);
        };

        const tieneRol = (rol: string) => !!sesion?.roles.includes(rol);

        return (
                <AuthContext.Provider value={{ sesion, cargando, iniciarSesion, cerrarSesion, tieneRol }}>
                        {children}
                </AuthContext.Provider>
        );
}

export function useAuth() {
        const ctx = useContext(AuthContext);
        if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
        return ctx;
}