import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  DollarSign, 
  Package, 
  Hash,
  ShoppingCart,
  Receipt,
  Tag
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetallesVenta } from '../api/productos.api';

function VentaDetalles() {
    const [venta, setVenta] = useState(null);
    const [productosVendidos, setProductosVendidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);

    const handleTableScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    // Si el usuario llega al final (con un margen de 10px), ocultamos la flecha
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
        setShowScrollIndicator(false);
    } else {
        setShowScrollIndicator(true);
    }
    };
  
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVentaDetalles = async () => {
        try {
            // Simulación de carga de datos
            // En producción: const response = await getVenta(params.id);
            const response = await getDetallesVenta(params.id);
            console.log(getDetallesVenta(params.id))
            setVenta(response.data.venta);
            setProductosVendidos(response.data.productos_vendidos);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener detalles de la venta:', error);
            setLoading(false);
        }
        };

        fetchVentaDetalles();
    }, [params.id]);

    const handleBack = () => navigate(-1);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    };

    const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

    if (loading) {
        return (
        <div className="p-4 lg:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1c2d47]"></div>
            <p className="text-gray-500">Cargando detalles de venta...</p>
            </div>
        </div>
        );
    }

    if (!venta) return null;

    return (
        <div className="p-4 lg:p-6 py-3 lg:pt-2 min-h-screen bg-gray-50/50 pb-20">
        {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={handleBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-[#1c2d47]" />
                        Venta #{venta.id}
                    </h1>
                    {/* <p className="text-sm text-gray-500">Consulta los detalles de la transacción realizada</p> */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                
                {/* Columna Principal - Lista de Productos Vendidos */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <div className="w-1 h-5 bg-[#1c2d47] rounded"></div>
                            <h3 className="text-gray-700 font-semibold">Productos en esta Venta</h3>
                        </div>
                        
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Producto</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Cantidad</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-nowrap text-right">Precio Unit.</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {productosVendidos.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                    <Package className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <span className="font-medium text-gray-800 text-nowrap">{item.producto_nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            <span className="bg-gray-100 px-2.5 py-1 rounded text-sm font-medium">
                                                {item.cantidad}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600 italic">
                                            {formatCurrency(item.precio_producto_vendido)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-[#1c2d47]">
                                            {formatCurrency(item.precio_producto_vendido * item.cantidad)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Scroll */}
                        <div className="lg:hidden flex items-center justify-center gap-2 py-2 text-gray-400 animate-pulse">
                            <span className="text-xs font-medium tracking-wider">Desliza para ver más</span>
                            <div className="flex animate-bounce-x">
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Lateral - Información de la Venta */}
                <div className="space-y-3">
                    {/* Card: Resumen de Transacción */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 space-y-6">
                            <div className="text-center pb-4 border-b border-gray-100">
                                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Cobrado</p>
                                <h2 className="text-3xl font-black text-[#1c2d47] mt-1">
                                {formatCurrency(venta.precio_total)}
                                </h2>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Atendido por:</p>
                                        <p className="text-sm font-bold text-gray-800">{venta.vendedor_nombre}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Fecha y Hora:</p>
                                        <p className="text-sm text-gray-800">{formatDate(venta.creado)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <ShoppingCart className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Items totales:</p>
                                        <p className="text-sm text-gray-800">
                                        {productosVendidos.reduce((acc, curr) => acc + curr.cantidad, 0)} unidades
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Tip Informativo */}
                    <div className="bg-[#1c2d47] rounded-lg p-5 text-white shadow-lg relative overflow-hidden">
                        <Tag className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
                        <h4 className="font-bold mb-1 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Venta Finalizada
                        </h4>
                        <p className="text-xs text-blue-100 leading-relaxed">
                        Esta venta ha descontado automáticamente el stock de los productos involucrados. 
                        No es posible editar las cantidades una vez confirmada.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default VentaDetalles;