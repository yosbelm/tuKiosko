import Header from './components/Header';
import { Link, Outlet } from 'react-router-dom';
import HeaderAuth from './components/HeaderAuth';
import { useState } from 'react';


export default function LayoutAuth({ autenticado }){
    return(
        <div className="bg-[#f4f7fa] min-h-screen font-['Open_Sans',sans-serif]">
            <main className="min-h-screen">
                <HeaderAuth autenticado={autenticado} />
                <Outlet /> 
            </main>
        </div>
    )
}