import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter, DollarSign, TrendingUp, Users } from "lucide-react";
import {getAllAdminVentas} from '../api/productos.api'
import VentasRow from '../components/VentasRow'
import {Link} from 'react-router-dom'
import fechaFinal from '../../utils/Date'



export default function TotalVentas() {
    const [ventas, setVentas] = useState([]);
    const [filteredVentas, setFilteredVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    // Filter states
    const [searchDate, setSearchDate] = useState("");
    const [searchName, setSearchName] = useState("");
    const [minAmount, setMinAmount] = useState("");

    // Load mock data on mount
    useEffect(() => {
        getAllAdminVentas()
        .then(response=>{
            setVentas(response.data.ventas_diarias);
            setFilteredVentas(response.data.ventas_diarias);
        }).catch(e=>{
            console.log(e)
        })
        setCargando(false);
    }, []);

    // Filter logic
    useEffect(() => {
        let results = [...ventas];

        // Filter by date
        if (searchDate) {
            results = results.filter(venta => {
                const ventaDate = new Date(venta.creado).toISOString().split('T')[0];
                return ventaDate === searchDate;
            });
        }

        // Filter by seller name
        if (searchName.trim()) {
            results = results.filter(venta => 
                venta.vendedor_nombre.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        // Filter by minimum amount
        if (minAmount) {
            results = results.filter(venta => venta.precio_total >= parseFloat(minAmount));
        }

        setFilteredVentas(results);
    }, [ventas, searchDate, searchName, minAmount]);

    // Calculate totals
    // const totalAcumulado = filteredVentas.reduce((sum, venta) => sum + venta.precio_total, 0);
    // const totalProductos = filteredVentas.reduce((sum, venta) => sum + venta.cantidad, 0);
    // const vendedoresUnicos = [...new Set(filteredVentas.map(v => v.vendedor_nombre))].length;

    return (
        <div className="p-4 lg:p-6 lg:pt-2 min-h-screen pb-24 lg:pb-24">
            <section className="animate-in fade-in duration-300 space-y-4">
                {/* Top Summary Card */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-100 rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-700">Total Acumulado</p>
                            <p className="text-2xl font-bold text-green-600">${totalAcumulado.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1c2d47] rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Productos Vendidos</p>
                            <p className="text-2xl font-bold text-gray-900">{totalProductos}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1c2d47] rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Vendedores</p>
                            <p className="text-2xl font-bold text-gray-900">{vendedoresUnicos}</p>
                        </div>
                    </div>
                </div> */}

                {/* Filter Bar */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Date Filter */}
                        <div className="space-y-1">
                            <label className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Buscar por Fecha</span>
                            </label>
                            <input 
                                type="date" 
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Name Filter */}
                        <div className="space-y-1">
                            <label className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Buscar por Vendedor</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Ej: Juan"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Amount Filter */}
                        <div className="space-y-1">
                            <label className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Monto Mínimo</span>
                            </label>
                            <input 
                                type="number" 
                                placeholder="Ej: 1000"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#1c2d47] rounded-full"></div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Total de Ventas</h3>
                                <p className="text-[11px] md:text-xs lg:text-xs text-gray-500">Registro completo de transacciones</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-[#1c2d47] text-[11px] md:text-[13px] lg:text-[13px] font-medium rounded-full">
                            {filteredVentas.length} ventas
                        </span>
                    </div>

                    {/* Responsive Table */}
                    <div className="max-h-[calc(100vh-250px)] lg:max-h-96 overflow-y-auto scrollbar-hide">
                        {cargando ? (
                            <div className="p-10 text-center text-gray-400">Cargando ventas...</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 lg:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Vendedor</th>
                                        {/* <th className="hidden md:table-cell px-4 py-3 lg:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Cantidad</th> */}
                                        <th className="px-4 py-3 lg:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Total</th>
                                        <th className="px-4 py-3 lg:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredVentas.length > 0 ? (
                                        filteredVentas.map((venta) => (
                                            <VentasRow 
                                                key={venta.id} 
                                                ventaId={venta.ticket_venta} 
                                                name={venta.vendedor_nombre} 
                                                precio={venta.precio_total} 
                                                cantidad={venta.cantidad}
                                                seed={venta.vendedor_genero} 
                                                date={fechaFinal(venta.creado)} 
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-6 text-center text-gray-500 text-sm">
                                                No se encontraron ventas con los filtros aplicados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Bounce Scroll Indicator */}
                    {!cargando && filteredVentas.length > 6 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none lg:hidden">
                            <div className="flex justify-center animate-bounce">
                                <span className="w-8 h-8 rounded-full bg-[#1c2d47]/90 backdrop-blur-sm flex items-center justify-center shadow-lg text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
