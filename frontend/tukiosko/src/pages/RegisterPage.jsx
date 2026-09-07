import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { toast } from 'sonner';
import { estaAutenticado, iniciarSesion, registrarUsuario } from '../api/productos.api';
import { useLocation } from 'react-router-dom';

export default function RegisterPage() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
    const location = useLocation();

    const handleRegistro = async (e) => {
        e.preventDefault();
        
        if (!nombre.trim()) {
            toast.error('El nombre es requerido');
            return;
        }
        if (!email.trim()) {
            toast.error('El correo electrónico es requerido');
            return;
        }
        if (!password.trim()) {
            toast.error('La contraseña es requerida');
            return;
        }
        if (password !== confirmarPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        if (password.length < 4) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setCargando(true);
        
        try {
            const queryParams = new URLSearchParams(location.search);
            const codigoReferido = queryParams.get('referido');

            const payload = {
                username: nombre, // El ID del vendedor actual
                password: password,
                email: email
            };
            await registrarUsuario(payload, codigoReferido);
            toast.success('Registro exitoso', {
                description: `Bienvenido ${nombre}, tu cuenta ha sido creada.`,
                duration: 3000,
            });

            
            await iniciarSesion(payload);
            const response = await estaAutenticado();
            const userRol = response?.data?.rol;
            if (userRol === "administrador") {
                window.location.replace("/panel", { replace: true })
            } else if (userRol === "vendedor") {
                window.location.replace("/historial", { replace: true })
            } else {
                window.location.replace("/", { replace: true })
            }
            
            setNombre('');
            setEmail('');
            setPassword('');
            setConfirmarPassword('');
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            toast.error('Error al crear la cuenta', {
                description: 'Por favor, intenta de nuevo más tarde.',
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
                        <h2 className="text-lg font-semibold text-gray-900">Crear Cuenta</h2>
                        <p className="text-sm text-gray-500 mt-1">Completa el formulario para registrarte</p>
                    </div>

                    <form className="p-6 space-y-6" onSubmit={handleRegistro}>
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nombre de Usuario</label>
                            <div className="relative">
                                <div className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Juan"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="w-full px-2 py-1 bg-gray-50 border-none rounded-lg focus:ring-0.5 focus:ring-blue-500/10 focus:border-none outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <div className="relative">
                                <div className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <input 
                                        type="email" 
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                            <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
                        </div>

                        {/* Confirmar Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                            <div className="relative">
                                <div className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                    <input 
                                        type={mostrarConfirmarPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={confirmarPassword}
                                        onChange={(e) => setConfirmarPassword(e.target.value)}
                                        className="w-full px-2 py-1 bg-gray-50 border-none rounded-lg focus:ring-0.5 focus:ring-blue-500/10 focus:border-none outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {mostrarConfirmarPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Botón de Registro */}
                        <div className="flex flex-col gap-4 pt-4">
                            <button 
                                type="submit" 
                                disabled={cargando}
                                className="w-full px-6 py-2.5 bg-[#1c2d47] hover:bg-[#373a3f] text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </button>
                        </div>

                        {/* Link a Login */}
                        <div className="text-center pt-2">
                            <p className="text-sm text-gray-500">
                                ¿Ya tienes una cuenta?{' '}
                                <a href="/" className="text-[#1c2d47] font-medium hover:underline transition-colors">
                                    Inicia sesión
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
