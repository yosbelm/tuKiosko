import {  ClipboardList, Users, HistoryIcon, Calculator } from "lucide-react"
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calculadora from "./Calculadora";
import { createPortal } from 'react-dom';


export default function NavBar({mostrar, total}) {
    const [abrirCalculadora, setAbrirCalculadora] = useState(false);
    const menuRef = useRef(null);

    const abrirCalculadoraButton = ()=>{
        setAbrirCalculadora(true);
        console.log('hice clcik en calculadora')
    };
            
    return (
      <div className="fixed bottom-2 left-0 z-50 w-full px-4 pb-2 flex justify-center">
        {/* <nav className="flex items-center justify-around bg-white border border-gray-200 rounded-2xl shadow-lg h-11 mx-w-sm max-w-md mx-auto"> */}
        <div className="flex justify-center">
            {/* <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1),0_4px_20px_rgba(0,0,0,0.1)] px-6.25 py-1.25"> */}
            <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1),0_4px_20px_rgba(0,0,0,0.1)] lg:px-10 px-6.25 py-1.5">
                <div className="flex items-end justify-around gap-5 lg:gap-10">
                    {/* Home */}
                    <Link to={"/historial"}>
                    <button className="flex flex-col items-center gap-0 text-gray-400 hover:text-gray-600 transition-colors">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg> */}
                        <HistoryIcon className="h-5 w-5"/>
                        <span className="text-xs font-medium">Historial</span>
                    </button>
                    </Link>

                    {/* Market */}
                    {/* <button className="flex flex-col items-center gap-0 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                        </svg>
                        <span className="text-xs font-medium">Market</span>
                    </button> */}

                    {/* Saved (Center - Highlighted) */}
                    {!mostrar ?
                        <Link to={"/agregar-compras"}>
                            <button className="flex flex-col items-center gap-0 -mt-8">
                                <div className="w-14 h-14 bg-[#1c2d47] text-white rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>                            
                                </div>
                                <span className="mt-2 text-xs text-[#1c2d47] font-medium"></span>
                            </button>
                        </Link> :
                        <button className="flex flex-col items-center gap-0 -mt-8" onClick={()=>abrirCalculadoraButton()}>
                            <div className="w-14 h-14 bg-[#1c2d47] text-white rounded-full flex items-center justify-center shadow-lg">
                                <Calculator className="w-6 h-6"/>                            
                            </div>
                            <span className="mt-2 text-xs text-[#1c2d47] font-medium"></span>
                        </button>
                    }

                    {/* Notifs */}
                    <Link to={"/productos-vendidos"}>
                    <button className="flex flex-col items-center gap-0 text-gray-400 hover:text-gray-600 transition-colors">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg> */}
                        <ClipboardList className="h-5 w-5"/>
                        <span className="text-xs font-medium">Productos</span>
                        
                    </button>
                    </Link>

                    {/* Account */}
                    {/* <button className="flex flex-col items-center 0 text-red-400 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span className="text-xs font-medium">Account</span>
                    </button> */}
                </div>
            </nav>
            {abrirCalculadora && createPortal(
                <Calculadora total={total} onClose={() => setAbrirCalculadora(false)} />,
                document.body
            )}
        </div>
      </div>
    );
  }
