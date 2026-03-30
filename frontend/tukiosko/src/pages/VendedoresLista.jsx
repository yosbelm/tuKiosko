import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  DollarSign, 
  MoreVertical, 
  ShieldCheck, 
  UserCircle,
  Clock
} from 'lucide-react';
import { getAllVendedores } from '../api/productos.api.js';

export default function VendedoresLista() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const response = await getAllVendedores();
        // Asumiendo que la respuesta trae la relación de Usuario y Vendedor
        setVendedores(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de vendedores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendedores();
  }, []);

  const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1c2d47]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 lg:pt-2 space-y-3">
      {/* Header Seccion */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {/* <Users className="w-6 h-6 text-[#1c2d47]" /> */}
            Equipo de Ventas
          </h1>
          {/* <p className="text-sm text-gray-500">Gestiona y visualiza el rendimiento de tus vendedores</p> */}
        </div>
      </div>

      {/* Grid de Vendedores */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {vendedores.map((v) => (
          <div 
            key={v.id} 
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Cabecera del Card */}
            <div className="p-5 border-b border-gray-50 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${v.genero === 'femenino' ? 'Isabella' : 'Carlos'}&backgroundColor=${v.genero === 'femenino' ? 'ffdfbf' : 'c0aede'}`}
                    alt="Avatar" 
                    className="w-12 h-12 rounded-full bg-gray-100 object-cover border border-gray-100"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${v.nombre?.status ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">
                    {v.nombre}
                  </h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {v.nombre?.rol || 'Vendedor'}
                  </span>
                </div>
              </div>
              {/* <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreVertical className="w-5 h-5" />
              </button> */}
            </div>

            {/* Detalles */}
            <div className="p-5 space-y-3">
              {/* <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{v.nombre?.email || 'Sin correo'}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{v.nombre?.telefono || 'Sin teléfono'}</span>
              </div> */}

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Salario Mensual</span>
                  <div className="flex items-center gap-1 text-[#1c2d47] font-bold">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{formatCurrency(v.salario)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider italic">Último Acceso</span>
                  <p className="text-xs text-gray-600 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatDate(v.nombre?.last_login)}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Acción (Opcional) */}
            <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className={`w-4 h-4 ${v.nombre?.is_active ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-gray-500">Cuenta Verificada</span>
              </div>
              {/* <button className="text-xs font-bold text-[#1c2d47] hover:underline">
                Ver Perfil
              </button> */}
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {!loading && vendedores.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-900 font-medium">No hay vendedores registrados</h3>
          <p className="text-sm text-gray-500">Comienza agregando uno nuevo en la sección de registro.</p>
        </div>
      )}
    </div>
  );
}