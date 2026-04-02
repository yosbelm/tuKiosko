import React, { useState, useEffect } from "react";
import UserRow from "../components/UserRow";
import { getAllVentas } from "../api/productos.api";
import fechaFinal from '../../utils/Date';

export default function Historial() {
    const [ventas, setVentas] = useState([]);
    const [productosVendidos, setProductosVendidos] = useState([]);
    const [dineroVentasDiarias, setDineroVentasDiarias] = useState("")
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const response = await getAllVentas();
                // Usamos ventas_diarias para mantener consistencia con tu Index
                setVentas(response.data.ventas_diarias || []);
                setDineroVentasDiarias(response.data.total_dinero_vendido.total_dinero_ventas || 0);
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
        <div className="min-h-screen mb-16">
            <div className="px-6 py-2 mb-3 bg-green-100 font-bold text-green-500 text-center rounded-xl border border-gray-200 shadow-sm">
                Total Dinero: ${dineroVentasDiarias}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                {/* Header del Historial */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-[#1c2d47] rounded-full"></div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Historial de Ventas</h3>
                            <p className="text-[11px] md:text-xs lg:text-xs text-gray-500">Registro de transacciones recientes</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-[#1c2d47] text-[11px] md:text-[13px] lg:text-[13px] font-medium rounded-full">
                        {ventas.length} ventas
                    </span>
                </div>

                {/* Tabla Responsiva */}
                <div className="max-h-[calc(100vh-150px)] lg:max-h-127 overflow-y-auto scrollbar-hide">
                    {cargando ? (
                        <div className="p-10 text-center text-gray-400">Cargando historial...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <tbody className="divide-y divide-gray-50">
                                {ventas.length > 0 ? (
                                    ventas.map((venta) => (
                                        <UserRow 
                                            key={venta.id} 
                                            ventaId={venta.ticket_venta} 
                                            name={venta.vendedor_nombre} 
                                            precio={venta.precio_total} 
                                            cantidad={venta.cantidad}
                                            seed={venta.vendedor_genero} 
                                            date={fechaFinal(venta.creado)} 
                                            status="online"
                                            urlRedirect="venta-detalles" 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td className="p-6 text-center text-gray-500 text-sm">
                                            No hay ventas registradas hoy.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Indicador de scroll (Bounce) */}
                {!cargando && ventas.length > 6 && (
                    <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none'>
                        <div className='flex justify-center animate-bounce'>
                            <span className='w-8 h-8 rounded-full bg-[#1c2d47]/90 backdrop-blur-sm flex items-center justify-center shadow-lg text-white'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}