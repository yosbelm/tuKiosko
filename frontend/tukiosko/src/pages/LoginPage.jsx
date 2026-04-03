import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { toast } from 'sonner';
import { iniciarSesion, estaAutenticado } from '../api/productos.api';
import { useNavigate, Navigate } from 'react-router-dom';
import {useAuth} from '../api/useAuth' 

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [rol, setRol] = useState(null);
    const { checkStatus } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!username.trim()) {
            toast.error('El correo electrónico es requerido');
            return;
        }
        if (!password.trim()) {
            toast.error('La contraseña es requerida');
            return;
        }

        setCargando(true);
        
        try {
            const payload = {
                username: username,
                password: password
            };
            await iniciarSesion(payload);
            await checkStatus();
            const response = await estaAutenticado();
            console.log(`este es el rolque llega ologinpag ${response.data.rol}`)
            const userRol = response.data.rol;
            setRol(response.data.rol)
            toast.success('Inicio de sesión exitoso', {
                description: 'Bienvenido de nuevo.',
                duration: 3000,
            });
            if (userRol === "administrador") {
                navigate("/panel");
            } else if (userRol === "vendedor") {
                navigate("/historial");
            } else {
                navigate("/");
            }
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            toast.error('Error al iniciar sesión', {
                description: 'Verifica tus credenciales e intenta de nuevo.',
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="p-4 lg:p-6 lg:pt-2 min-h-screen flex items-center justify-center">
            <section className="animate-in fade-in duration-300 w-full max-w-md">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Iniciar Sesión</h2>
                        <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales para acceder</p>
                    </div>

                    <form className="p-6 space-y-6" onSubmit={handleLogin}>
                        {/* username */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nombre de Usuario</label>
                            <div className="relative">
                                <div className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <input 
                                        type="username" 
                                        placeholder="Ej: Juan"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-2 py-1 bg-gray-50 border-none rounded-lg focus:ring-0.5 focus:ring-blue-500/10 focus:border-none outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Contraseña</label>
                            <div className="relative">
                                <div className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                    <input 
                                        type={mostrarPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        autoComplete="current-password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-2 py-1 bg-gray-50 border-none rounded-lg focus:ring-0.5 focus:ring-blue-500/10 focus:border-none outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarPassword(!mostrarPassword)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {mostrarPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Olvidaste contraseña */}
                        {/* <div className="flex justify-end">
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div> */}

                        {/* Botón de Login */}
                        <div className="flex flex-col gap-4 pt-4">
                            <button 
                                type="submit" 
                                disabled={cargando}
                                className="w-full px-6 py-2.5 bg-[#1c2d47] hover:bg-[#373a3f] text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </div>

                        {/* Link a Registro */}
                        <div className="text-center pt-2">
                            <p className="text-sm text-gray-500">
                                ¿No tienes una cuenta?{' '}
                                <a href="/registro" className="text-[#1c2d47] font-medium hover:underline transition-colors">
                                    Regístrate aquí
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
