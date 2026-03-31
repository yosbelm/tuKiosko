import { useState, useEffect, useRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from './components/SideBar';
import Header from './components/Header';
import React from 'react';
import { ChartLine, BoxIcon, LocationEditIcon, PackageOpen, User2, Settings2, Plus } from "lucide-react"
import NavBar from './components/NavBar';



export default function Layout({autenticado}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('area');
  const menuRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
        activeTab === id 
          ? 'bg-blue-500 text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-[#f4f7fa] min-h-screen font-['Open_Sans',sans-serif]">
      {/* Pasamos el estado y la función al Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} closeOnLink={closeSidebarOnMobile} />
      <main className="md:ml-64 min-h-screen">
        <Header toggle={toggleSidebar} autenticado={autenticado} />
        <Outlet context={{ toggleSidebar }} /> 

        {/* FAB Menu */}
        <Link to={"/agregar-compra"}>
        <div className="fixed bottom-6 right-6 z-50">
            {/* <div className={`absolute bottom-16 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-w-50 transition-all duration-200 origin-bottom-right ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                <button onClick={() => { setActiveTab('area'); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">A</div>
                    <span className="text-sm font-medium text-gray-900">Nueva Área</span>
                </button>
                <button onClick={() => { setActiveTab('producto'); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                        {<Plus className="w-4 h-4" />}
                    </div>
                    
                        <span className="text-sm font-medium text-gray-900">Nuevo Compra</span>
                </button>
            </div> */}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`w-14 h-14 bg-[#1c2d47] hover:bg-[#373a3f] text-white cursor-help rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${isMenuOpen ? 'rotate-45' : ''}`}
              title="Agrega una nueva venta.">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
        </div>
        </Link>

      </main>
      
      {/* El Outlet necesita acceso a toggleSidebar si el botón está en las páginas hijas */}
    </div>
  );
}