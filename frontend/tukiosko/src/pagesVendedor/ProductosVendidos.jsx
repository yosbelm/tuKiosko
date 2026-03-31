import React, { useState, useEffect, useMemo } from "react";
import RightColumn from "../components/RightColumn";
import { getAllVentas, getAllProducts } from "../api/productos.api";
import fechaFinal from '../../utils/Date';
import {Package, Search, Plus} from 'lucide-react';

export default function ProductosVendidos() {
    const [ventas, setVentas] = useState([]);
    const [productosVendidos, setProductosVendidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [searchTerm, setSearchTerm] = useState("")
    const [showDropdown, setShowDropdown] = useState(false);
    const [productos, setProductos] = useState([])

    useEffect(() => {
        getAllProducts()
            .then(response => {
            setProductos(response.data);
            console.log(response.data)
            })
            .catch(error => {
            console.error('Error al obtener productos:', error);
            });
    },[])

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
        addToOrder(product);
        setSearchTerm(""); // Limpiamos la búsqueda tras elegir
        setShowDropdown(false); // Cerramos el menú
    };

    const total = useMemo(() => {
        return productos.reduce((sum, item) => sum + item.price * item.cantidad, 0)
    }, [productos])

    

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const response = await getAllVentas();
                // Usamos ventas_diarias para mantener consistencia con tu Index
                setVentas(response.data.ventas_diarias || []);
                setProductosVendidos(response.data.productos_vendidos || []);
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
                        {showDropdown && searchTerm.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                searchResults.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleSelectProduct(product)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-blue-50 border-b border-gray-50 last:border-none transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#1c2d47] rounded flex items-center justify-center">
                                            <Package className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900 group-hover:text-black">{product.nombre}</p>
                                            <p className="text-xs text-gray-500">• Ubicación: {product.ubicacion}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {/* <span className="font-bold text-green-700">${product.precio_venta}</span> */}
                                        {/* <Plus className="w-5 h-5 text-green-700 opacity-100 transition-opacity" /> */}
                                    </div>
                                </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                No se encontraron productos con "{searchTerm}"
                                </div>
                            )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-1 scrollbar-hide relative">
                    <div className="bg-white rounded-lg shadow-sm p-0 overflow-x-auto scrollbar-thin">
                        <div className="px-6 py-3 flex items-center gap-2 sticky left-0">
                            <div className="w-1.5 h-6 bg-[#1c2d47] rounded-full"></div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Productos Vendidos</h3>
                                <p className="text-xs text-gray-500">Total de cada producto vendido</p>
                            </div>
                        </div>
                    {productosVendidos.map(pv =>(
                        <RightColumn key={pv.id} precio={pv.precio} cantidad={pv.cantidad_total} producto={pv.nombre} 
                        creado={pv.creado}/>
                    ))}
                    </div>
                    {/* 
                    <IconWidget icon="fa-bolt" color="bg-[#00ead0]/10" iconColor="text-[#00ead0]" value="235" label="Total Ideas" />
                    <IconWidget icon="fa-map-marker-alt" color="bg-blue-100" iconColor="text-blue-500" value="26" label="Total Locations" /> */}
                    {productosVendidos.length > 6 && (
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