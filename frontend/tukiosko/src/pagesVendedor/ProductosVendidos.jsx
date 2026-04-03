import React, { useState, useEffect, useMemo } from "react";
import RightColumn from "../components/RightColumn";
import { getAllVentas } from "../api/productos.api";
import fechaFinal from '../../utils/Date';
import {Package, Search, Plus} from 'lucide-react';

export default function ProductosVendidos() {
    const [productosVendidos, setProductosVendidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [cantidadProductosDiarios, setCantidadProductosDiarias] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);


    // Modificamos el filtrado para que solo actúe si hay texto
    const searchResults = useMemo(() => {
    if (searchTerm.trim() === "") return [];
    return productosVendidos.filter(
        (product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    }, [searchTerm]);

    const handleSelectProduct = (product) => {
        setSearchTerm(""); // Limpiamos la búsqueda tras elegir
        setShowDropdown(false); // Cerramos el menú
    };

    const productosFiltrados = productosVendidos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
      );

    

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const response = await getAllVentas();
                // Usamos ventas_diarias para mantener consistencia con tu Index
                setProductosVendidos(response.data.productos_vendidos || []);
                setCantidadProductosDiarias(response.data.productos_vendidos_count.total_productos || 0);
            } catch (error) {
                console.error('Error al obtener ventas:', error);
            } finally {
                setCargando(false);
            }
        };

        fetchDatos();
    }, []);

    return (
            <div className="rounded-xl gap-3">
                <div className="w-full">
                    {/* Search Bar */}
                    <div className="relative mb-3 rounded-xl border border-gray-200 shadow-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre..."
                            value={searchTerm}
                            onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                        />
                        
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-1 scrollbar-hide relative">
                    <div className="bg-white rounded-lg shadow-sm p-0 overflow-x-auto scrollbar-thin">
                        <div className="px-6 py-3 flex justify-between sticky left-0">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-[#1c2d47] rounded-full"></div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Productos Vendidos</h3>
                                    <p className="text-[11px] md:text-xs lg:text-xs text-gray-500">Total de cada producto vendido</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="px-3 py-1 bg-gray-100 text-[#1c2d47] text-[11px] md:text-[13px] lg:text-[13px] rounded-full">
                                    Total: {cantidadProductosDiarios}
                                </span>
                            </div>
                        </div>
                    {productosFiltrados.map(pv =>(
                        <RightColumn key={pv.id} precio={pv.precio} cantidad={pv.cantidad_total} producto={pv.nombre} 
                        creado={pv.creado}/>
                    ))}
                    </div>
                    {/* 
                    <IconWidget icon="fa-bolt" color="bg-[#00ead0]/10" iconColor="text-[#00ead0]" value="235" label="Total Ideas" />
                    <IconWidget icon="fa-map-marker-alt" color="bg-blue-100" iconColor="text-blue-500" value="26" label="Total Locations" /> */}
                    {productosFiltrados.length > 6 && (
                        <div className='sticky bottom-4 z-10 flex justify-center animate-bounce'>
                            <span className='w-6 h-6 uppercase rounded-full bg-[#1c2d47] flex items-center justify-center shrink-0 text-amber-50'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                            </svg>
                            </span>
                        </div>
                    )}
                </div>
            </div>
    );
}