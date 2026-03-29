import React, { useEffect, useState } from 'react';
import { Package, DollarSign, AlertTriangle, XCircle, Search, Plus, MapPin, Calendar } from 'lucide-react';
import {getAllProducts, getTodosProductos} from '../api/productos.api'
import { Link } from 'react-router-dom';


// Componente StatCard interno para mantener el estilo consistente
const StatCard = ({ title, icon, iconBg, value, subtitle, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
    <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center text-white shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-gray-500 text-sm truncate">{title}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
    <div className={`w-1 h-12 ${color} rounded`}></div>
  </div>
);

function ProductoLista() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de llamada a API getAllProducts()
    getTodosProductos()
    .then(response=>{
      setProductos(response.data);
    })
    const fetchProductos = async () => {
      try {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        // En producción: const response = await getAllProducts();
        // setProductos(response.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Filtrar productos por término de búsqueda
  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculos para las estadísticas
  const totalProductos = productos.length;

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Formatear moneda
  const formatCurrency = (value) => {
    return `$${value}`;
  };

  return (
    <div className="p-4 lg:p-6 lg:pt-2 min-h-screen">


      {/* Tabla de Productos */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header con búsqueda y botón agregar */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#1c2d47] rounded"></div>
            <h3 className="text-gray-700 font-semibold">Lista de Productos</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#373a3f] focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            {/* Botón Agregar */}
            {/* <button className="flex items-center justify-center gap-2 bg-[#1c2d47] hover:bg-[#2a3f5f] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Agregar Producto
            </button> */}
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto scrollbar-hide">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1c2d47]"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-3 flex-nowrap text-xs text-center font-semibold text-gray-500 uppercase">Producto</th>
                  <th className="px-3 py-3 flex-nowrap text-xs text-center font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-3 py-3 flex-nowrap text-xs text-center font-semibold text-gray-500 uppercase">P.Compra</th>
                  <th className="px-3 py-3 flex-nowrap text-xs text-center font-semibold text-gray-500 uppercase">P.Venta</th>
                  <th className="px-3 py-3 flex-nowrap text-xs text-center font-semibold text-gray-500 uppercase">Cantidad</th>
                  <th className="px-3 py-3 flex-nowrap text-xs text-center font-semibold text-gray-500 uppercase">Ubicación</th>
                  <th className="px-3 py-3 flex-nowrap text-xs text-center font-semibold text-gray-500 uppercase">Creado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((producto) => (
                    <tr key={producto.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <Link to={`/producto-detalles/${producto.id}`}>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#1c2d47]/10 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-blue-900" />
                            </div>
                            <span className="font-medium text-blue-900 text-nowrap">{producto.nombre}</span>
                          </div>
                        </td>
                      </Link>
                      <td className="px-3 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          producto.activo 
                            ? 'bg-green-200 text-[#0d9f7e]' 
                            : 'bg-red-200 text-red-500'
                        }`}>
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-gray-600 font-medium">
                        {formatCurrency(producto.precio_compra)}
                      </td>
                      <td className="px-3 py-4 text-[#1c2d47] font-semibold">
                        {formatCurrency(producto.precio_venta)}
                      </td>
                      <td className="px-3 py-4 flex justify-center items-center gap-1">
                        <span className={`font-medium ${
                          producto.cantidad < 5 
                            ? 'text-amber-600' 
                            : 'text-gray-700'
                        }`}>
                          {producto.cantidad}
                          {producto.cantidad < 5 && (
                            <AlertTriangle className="inline-block w-3 h-3 mb-0.5 text-amber-500" />
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center text-nowrap">
                          <MapPin className="w-4 h-4 text-[#373a3f]" />
                          <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm">
                            {producto.ubicacion}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1 text-gray-500 text-sm text-nowrap">
                          <Calendar className="w-4 h-4" />
                          {formatDate(producto.creado)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No se encontraron productos</p>
                      <p className="text-sm">Intenta con otro término de búsqueda</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer con información */}
        {!loading && productosFiltrados.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Mostrando {productosFiltrados.length} de {totalProductos} productos</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#1de9b6] rounded-full"></span>
              <span>Última actualización: Hoy</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductoLista;
