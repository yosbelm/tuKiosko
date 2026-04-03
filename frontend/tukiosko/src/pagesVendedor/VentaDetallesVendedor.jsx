import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Package, 
  ShoppingCart,
  Receipt,
  ChevronRight
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {getDetallesVenta} from '../api/productos.api';
import fechaFinal from '../../utils/Date'


export default function VentaDetallesVendedor() {
    const [venta, setVenta] = useState(null);
    const [productosVendidos, setProductosVendidos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVentaDetalles = async () => {
            try {
                const response = await getDetallesVenta(params.id);
                setVenta(response.data.venta);
                setProductosVendidos(response.data.productos_vendidos);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener detalles:', error);
                setLoading(false);
            }
        };
        fetchVentaDetalles();
    }, [params.id]);

    const handleBack = () => navigate(-1);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    };

    const formatCurrency = (value) => `$${Number(value).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;

    if (loading) {
        return (
            <div className="p-4 lg:p-6 flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1c2d47] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Cargando detalles...</p>
            </div>
        );
    }

    if (!venta) return null;

    return (
        <div className="sm: mb-20">
            {/* Header / Navegación */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleBack} 
                        className="p-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#1c2d47]" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Venta ID: {params.id}
                        </h1>
                        {/* <p className="text-xs text-gray-500 font-medium">Detalles de la transacción</p> */}
                    </div>
                </div>
                <div className="hidden md:hidden lg:flex sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100 text-xs font-bold">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    VENTA COMPLETADA
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LADO IZQUIERDO: Lista de Productos (Ocupa 8 columnas en PC) */}
                <div className="lg:col-span-7 space-y-3">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-3 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-5 bg-[#1c2d47] rounded-full"></div>
                                <h3 className="font-bold text-gray-700 tracking-wider">Productos Vendidos</h3>
                            </div>
                            <span className="text-xs font-bold text-gray-500 bg-white border px-2 py-0.5 rounded shadow-sm">
                                {productosVendidos.length} items
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100">
                                        <th className="px-3 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Descripción</th>
                                        <th className="px-3 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Cant.</th>
                                        <th className="px-3 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Precio</th>
                                        <th className="px-3 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {productosVendidos.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-3 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-[#1c2d47] border border-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Package className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="font-semibold text-gray-800 text-sm text-nowrap">{item.producto_nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 text-center">
                                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-md">
                                                {item.cantidad}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 text-right text-sm text-gray-500 tabular-nums">
                                            {formatCurrency(item.precio_producto_vendido)}
                                        </td>
                                        <td className="px-3 py-4 text-right font-bold text-green-500 text-sm tabular-nums">
                                            {formatCurrency(item.precio_producto_vendido * item.cantidad)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Scroll hint para móvil */}
                        <div className="lg:hidden p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
                            <ChevronRight className="w-4 h-4 text-gray-400 animate-bounce-x" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Desliza para ver precios</span>
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: Resumen (Ocupa 4 columnas en PC) */}
                <div className="lg:col-span-5 space-y-3">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 overflow-hidden relative">
                        {/* Círculos decorativos tipo ticket */}
                        <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-50 rounded-full border border-gray-200 shadow-inner"></div>
                        <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-50 rounded-full border border-gray-200 shadow-inner"></div>

                        <div className="text-center pb-2 border-b border-dashed border-gray-200">
                            <p className="text-[10px] font-black text-gray-400 mb-1">Total de la Venta</p>
                            <h2 className="text-2xl font-black text-green-500 tracking-tight">
                                {formatCurrency(venta.precio_total)}
                            </h2>
                        </div>

                        <div className="pt-3 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#1c2d47]/5 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#1c2d47]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 ">Vendedor Responsable</p>
                                    <p className="text-sm font-black text-gray-800 tracking-tight">{venta.vendedor_nombre}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#1c2d47]/5 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-[#1c2d47]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400">Fecha de Emisión</p>
                                    <p className="text-sm text-gray-700">{fechaFinal(venta.creado)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#1c2d47]/5 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-[#1c2d47]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400">Volumen de Compra</p>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {productosVendidos.reduce((acc, curr) => acc + curr.cantidad, 0)} unidades totales
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botón de acción adicional (opcional) */}
                        <div className="mt-4">
                            <button 
                                onClick={() => window.print()} 
                                className="w-full py-3 bg-[#1c2d47] hover:bg-[#2a3e5d] text-white text-xs font-bold rounded-xl transition-all shadow-md uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Receipt className="w-4 h-4" />
                                Imprimir Comprobante
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-[10px] text-center text-gray-400 font-medium italic">
                        ID Único de Transacción: {params.id}
                    </p>
                </div>
            </div>
        </div>
    );
}

