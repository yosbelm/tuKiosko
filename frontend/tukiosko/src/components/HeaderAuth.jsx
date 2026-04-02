import { Users, Bell, ChevronDown, MenuIcon, LogOut, LogIn, InfoIcon, User } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Link, useResolvedPath, useNavigate } from 'react-router-dom';
import {cerrarSesion} from '../api/productos.api'
import {toast} from "sonner";
import NavBar from "../components/NavBar";
import {useAuth} from "../api/useAuth"


export default function HeaderAuth({autenticado, totalVenta}) {
    const urlDirection = useResolvedPath();
    const url = urlDirection.pathname;
    const [urlFinal, setUrlFinal] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mostrarNav, setMostrarNav] = useState(false);
    const [mostrarCalculadora, setMostrarCalculadora] = useState(false);
    const [mostrarIcons, setMostrarIcons] = useState(true);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Cerrar el menú si se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    
    const handleLogout = async () => {
        try {
          await cerrarSesion();
          logout();

          toast.success('Ha cerrado sesión', {
            description: `Ha cerrado sesión satisfactoriamente.`,
            duration: 3000,
          });
          navigate("/")
        } catch (error) {
          toast.error('Error al cerrar sesión', {
            description: `Ocurrió un error al cerrar sesión: ${error}.`,
            duration: 3000,
          });
        } 
      };

    useEffect(() => {
        if (url === '/registro') {
            setUrlFinal(" Registrarse /");
            setMostrarIcons(false);
        } else if (url === '/') {
            setUrlFinal(" Iniciar sesión /");
            setMostrarIcons(false);
        }else if (url === '/historial') {
            setUrlFinal(" Historial /");
            setMostrarNav(true);
            setMostrarCalculadora(false);
        }else if (url === '/productos-vendidos') {
            setUrlFinal(" Productos Vendidos /");
            setMostrarNav(true);
            setMostrarCalculadora(false);
        }else if (url === '/agregar-compras') {
            setUrlFinal(" Agregar Compra /");
            setMostrarNav(true);
            setMostrarCalculadora(true);
        }else if (url.split("/")[1] === 'venta-detalles') {
            setUrlFinal(" Detalles Compra /");
            setMostrarNav(true);
            setMostrarCalculadora(false);
        } else {
            setUrlFinal(" Panel ");
            setMostrarNav(true);;
        }
    }, [url]);

    console.log(`desde header auth ${autenticado}`)
    const direccionUrl = () =>{
        if(autenticado){
            navigate('/panel/')
        }else{
            navigate('/')
        }
    } 

    const handleChevron = () => {
        setIsMenuOpen(!isMenuOpen);
      } 

    return (
        <header className="sticky top-0 left-0 z-40">
            <div className="flex items-center justify-between pl-4 pr-8 pb-0 py-4">
                <div className="flex items-center gap-4">
                    <button className="hidden sm:block text-gray-400 hover:text-gray-600">
                        <i className="fas fa-expand"></i>
                    </button>
                    <div className="flex items-center justify-center gap-2 text-gray-600 cursor-pointer">
                        <a onClick={direccionUrl}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
                                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                            </svg>
                        </a>
                        <span className="font-medium" style={{ fontSize: 13 }}> / {urlFinal}</span>
                    </div>
                </div>

                {mostrarIcons && (
                    <div className="flex items-center gap-4 relative" ref={menuRef}>
                        <button className="relative text-gray-400 hover:text-gray-600">
                            <Bell className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`flex items-center gap-1 px-0 py-1.5 rounded-lg transition-all duration-200 ${
                                isMenuOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1 animate-in fade-in zoom-in duration-200 z-50">
                                { autenticado === null ? 
                                <Link 
                                    to="/" 
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="w-4 h-4 text-gray-400" />
                                    Sobre Nosotros
                                </Link>:(
                                    
                                    <>
                                    <Link to={"/vendedor-cuenta"}>
                                    <button
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        handleChevron()
                                    }}
                                    >
                                        <User className="w-4 h-4" />
                                        Cuenta
                                    </button>    
                                    </Link>
                                    <button 
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        onClick={() => {
                                            console.log("Logout...");
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar sesión
                                    </button>
                                    </>
                                    )
                                }
                            </div>
                        )}
                        {mostrarNav && (
                            <NavBar mostrar={mostrarCalculadora} total={totalVenta} />
                        )}
                    </div>
                )}                
            </div>
        </header>
    );
}