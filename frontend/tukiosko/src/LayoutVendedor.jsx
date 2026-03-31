import Header from './components/Header';
import { Link, Outlet } from 'react-router-dom';
import HeaderAuth from './components/HeaderAuth';
import { useState } from 'react';


export default function LayoutVendedor({ autenticado }){
    return(
        <div className="bg-[#f4f7fa] font-['Open_Sans',sans-serif]">
            <HeaderAuth autenticado={autenticado} />
            <div className="w-full lg:w-[70%] md:w-[60%] mx-auto p-4 lg:p-6 lg:pt-2 animate-in fade-in duration-500">
                <main className="min-h-screen">
                    <Outlet /> 
                </main>
            </div>
        </div>
    )
}