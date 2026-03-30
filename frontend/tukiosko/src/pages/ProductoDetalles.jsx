import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ArrowLeft, 
  Save, 
  X, 
  Edit3, 
  MapPin, 
  DollarSign, 
  Hash, 
  Calendar,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getProducto, patchProducto } from '../api/productos.api';
import { useParams, useNavigate } from 'react-router-dom';
import {toast} from "sonner"


function ProductoDetalles({ productoId, onBack, onSave }) {
  const [producto, setProducto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const params = useParams()
  const navigate = useNavigate()


  useEffect(() => {
    const fetchProducto = async () => {
        getProducto(params.id)
        .then(response=>{
            setProducto(response.data.producto);
            setFormData(response.data.producto);
            console.log(response.data.producto);
        }).catch(error=>{
            console.log(`error: ${error}`);
        });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            // En producción: const response = await getProductById(productoId);
            
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener producto:', error);
            setLoading(false);
        }
    };

    fetchProducto();
  }, [productoId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await patchProducto(params.id, formData)
      setProducto(formData);
      setEditMode(false);
      toast.success('Actualización exitosa', {
        description: `Se ha actualizado el producto ${formData.nombre} satisfactoriamente.`,
        duration: 3000,
      });
      if (onSave) onSave(formData);
    } catch (error) {
      toast.error('Error al guardar los cambios', {
        description: `Ocurrió un error al actualizar el producto ${formData.nombre}.`,
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(producto);
    setEditMode(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    return `$${Number(value).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 py-3 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1c2d47]"></div>
          <p className="text-gray-500">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="p-4 lg:p-6 py-3 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-medium">Producto no encontrado</p>
          <button
            onClick={handleBack}
            className="mt-4 text-[#1c2d47] hover:underline flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 py-3 lg:pt-2 min-h-screen">
      {/* Notificación */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-[#1de9b6] text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{producto.nombre}</h1>
            {/* <p className="text-sm text-gray-500">ID: #{producto.id}</p> */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-[#1c2d47] hover:bg-[#373a3f] text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 bg-[#1c2d47] hover:bg-[#2a3f5f] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Columna Principal - Formulario */}
        <div className="lg:col-span-2 space-y-3">
          {/* Información Básica */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#1c2d47] rounded"></div>
              <h3 className="text-gray-700 font-semibold">Información Básica</h3>
            </div>
            <div className="p-6 py-3 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Nombre del Producto
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6] focus:border-transparent"
                    placeholder="Nombre del producto"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg">
                    <Package className="w-5 h-5 text-[#1c2d47]" />
                    <span className="text-gray-800 font-medium">{producto.nombre}</span>
                  </div>
                )}
              </div>

              {/* Estado Activo */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Estado del Producto
                </label>
                {editMode ? (
                  <button
                    type="button"
                    onClick={() => handleInputChange('activo', !formData.activo)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors w-full ${
                      formData.activo
                        ? 'bg-[#1de9b6]/10 border-[#1de9b6] text-[#1c2d47]'
                        : 'bg-red-50 border-red-200 text-red-600'
                    }`}
                  >
                    {formData.activo ? (
                      <ToggleRight className="w-6 h-6" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                    <span className="font-medium">
                      {formData.activo ? 'Producto Activo' : 'Producto Inactivo'}
                    </span>
                  </button>
                ) : (
                  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${
                    producto.activo
                      ? 'bg-[#1de9b6]/10'
                      : 'bg-red-50'
                  }`}>
                    {producto.activo ? (
                      <ToggleRight className="w-5 h-5 text-[#0d9f7e]" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`font-medium ${
                      producto.activo ? 'text-[#0d9f7e]' : 'text-red-600'
                    }`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                )}
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Ubicación del Producto
                </label>
                {editMode ? (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.ubicacion}
                      onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6] focus:border-transparent"
                      placeholder="Ej: Estante A1"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#1de9b6]" />
                    <span className="text-gray-800 bg-gray-100 px-3 py-1 rounded">{producto.ubicacion}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Precios y Stock */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#1c2d47] rounded"></div>
              <h3 className="text-gray-700 font-semibold">Precios e Inventario</h3>
            </div>
            <div className="p-6 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Precio Compra */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Precio de Compra
                  </label>
                  {editMode ? (
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precio_compra}
                        onChange={(e) => handleInputChange('precio_compra', parseFloat(e.target.value) || 0)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6] focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-800 font-medium">{formatCurrency(producto.precio_compra)}</span>
                    </div>
                  )}
                </div>

                {/* Precio Venta */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Precio de Venta
                  </label>
                  {editMode ? (
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precio_venta}
                        onChange={(e) => handleInputChange('precio_venta', parseFloat(e.target.value) || 0)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6] focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1de9b6]/10 rounded-lg">
                      <DollarSign className="w-5 h-5 text-[#0d9f7e]" />
                      <span className="text-[#0d9f7e] font-bold">{formatCurrency(producto.precio_venta)}</span>
                    </div>
                  )}
                </div>

                {/* Cantidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Cantidad en Stock
                  </label>
                  {editMode ? (
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        value={formData.cantidad}
                        onChange={(e) => handleInputChange('cantidad', parseInt(e.target.value) || 0)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6] focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${
                      producto.cantidad < 5 ? 'bg-amber-50' : 'bg-gray-50'
                    }`}>
                      {/* <Hash className={`w-5 h-5 ${producto.cantidad < 5 ? 'text-amber-500' : 'text-gray-500'}`} /> */}
                      <span className={`font-medium ${producto.cantidad < 5 ? 'text-amber-600' : 'text-gray-800'}`}>
                        {producto.cantidad} unidades
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Lateral - Resumen */}
        <div className="space-y-3">
          {/* Card de Resumen */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#1c2d47] rounded"></div>
              <h3 className="text-gray-700 font-semibold">Resumen</h3>
            </div>
            <div className="p-6 py-3">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Valor Compra</span>
                  <span className="font-bold text-gray-800">
                    {formatCurrency(formData.precio_compra * formData.cantidad)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Ingreso Potencial</span>
                  <span className="font-bold text-[#0d9f7e]">
                    {formatCurrency(formData.precio_venta * formData.cantidad)}
                  </span>
                </div>
                {/* <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Ganancia Potencial</span>
                  <span className="font-bold text-[#1c2d47]">
                    {formatCurrency((formData.precio_venta - formData.precio_compra) * formData.cantidad)}
                  </span>
                </div> */}
                {/* Ganancia Potencial */}
                <div className="border-t border-gray-100">
                    <div className="flex items-center justify-between p-4 py-3 bg-[#1c2d47] rounded-lg text-white">
                    <span className="text-sm opacity-80">Ganancia Potencial</span>
                    <span className="text-xl font-bold">{formatCurrency((formData.precio_venta - formData.precio_compra) * formData.cantidad)}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Fechas */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="w-1 h-5 bg-gray-400 rounded"></div>
              <h3 className="text-gray-700 font-semibold">Historial</h3>
            </div>
            <div className="p-6 py-3 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Creación</p>
                  <p className="text-gray-800 text-sm">{formatDate(producto.creado)}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductoDetalles;
