import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { postNuevoProducto } from "../api/productos.api"
import { toast } from 'sonner';
import { getAllAreas } from '../api/productos.api'


export default function AgregarProducto() {
  const { toggleSidebar } = useOutletContext();
  const [activeTab, setActiveTab] = useState('area');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    const [nombre, setNombre] = useState("");
    const [activo, setActivo] = useState(true);
    const [precioCompra, setPrecioCompra] = useState(0);
    const [precioVenta, setPrecioVenta] = useState(0);
    const [cantidad, setCantidad] = useState(1);
    const [ubicacion, setUbicacion] = useState([]);
    const [definirUbicacion, setDefinirUbicacion] = useState("")
    const [cargando, setCargando] = useState(false);


    const agregarProducto = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return alert("El nombre es requerido");
        setCargando(true);
        console.log({
          "nombre": nombre,
          "activo": activo,
          "precio_compra": precioCompra,
          "precio_venta": precioVenta,
          "cantidad": cantidad,
          "ubicacion": definirUbicacion
        })
        try {
            await postNuevoProducto(
              {
                "nombre": nombre,
                "activo": activo,
                "precio_compra": precioCompra,
                "precio_venta": precioVenta,
                "cantidad": cantidad,
                "ubicacion": definirUbicacion
              }
            );
            toast.success('Producto agregado correctamente', {
                description: `Se ha añadido "${nombre}" a la lista de productos.`,
                duration: 3000,
            });
            setNombre("");
            setPrecioCompra(0);
            setPrecioVenta(0);
            setCantidad(1);
            setDefinirUbicacion(definirUbicacion);
        } catch (error) {
            console.error("Error al crear área:", error);
            alert("Hubo un error al guardar");
        } finally {
            setCargando(false);
        }
    };


    useEffect(() => {
      async function allAreas (){
        await getAllAreas()
          .then(response => {
            setUbicacion(response.data);
            if (response.data.length > 0 && !definirUbicacion) {
              setDefinirUbicacion(response.data[0].nombre);
            }
            console.log(response.data)
          })
          .catch(error => {
            console.error('Error al obtener areas:', error);
          }); 
      };
      allAreas();
    }, [])

  return (
        <>
            <div className="p-4 lg:p-6 lg:pt-2">
                <section className="animate-in fade-in duration-300">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Crear Nuevo Producto</h2>
                        {/* <p className="text-sm text-gray-500 mt-1">Agrega productos a tu inventario</p> */}
                    </div>
                    <form className="p-6 space-y-6" onSubmit={agregarProducto}>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Nombre del Producto</label>
                          <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 
                          rounded-lg focus:border-blue-500 outline-none" value={nombre} placeholder='Ej: Galletas'
                          onChange={(e) => setNombre(e.target.value)} />
                        </div>

                        <div className="flex items-center justify-between py-2">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Producto Activo</label>
                            <p className="text-xs text-gray-500">Disponible para la venta</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white
                            after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                            after:transition-all peer-checked:bg-[#1c2d47]"></div>
                        </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Precio de Venta</label>
                                <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input type="number" className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg
                                 focus:border-blue-500 outline-none" value={precioVenta}
                                 onChange={(e) => setPrecioVenta(e.target.value)}/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Precio de Compra</label>
                                <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input type="number" className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg
                                 focus:border-blue-500 outline-none" value={precioCompra}
                                 onChange={(e) => setPrecioCompra(e.target.value)}/>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Cantidad</label>
                                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 w-fit">
                                  <button type="button" onClick={() => setCantidad(Math.max(0, cantidad - 1))} className="px-4 py-2 hover:bg-gray-100 text-gray-600">−</button>
                                  <input type="number" value={cantidad} className="w-16 bg-transparent text-center font-normal border-x border-gray-200" 
                                  onChange={(e) => setCantidad(e.target.value)} />
                                  <button type="button" onClick={() => setCantidad(cantidad + 1)} className="px-4 py-2 hover:bg-gray-100 text-gray-600">+</button>
                                </div>
                            </div>
                            <div className='space-y-2'>
                              <label className="text-sm font-medium text-gray-700">Ubicación</label>
                              <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🚹</span>
                                  <select 
                                      name="zona" value={definirUbicacion}
                                      onChange={(e) => setDefinirUbicacion(e.target.value)}
                                      className="w-full pl-12 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 appearance-none cursor-pointer transition-all"
                                  >
                                      {ubicacion.map(ubc => (
                                          <option key={ubc.id} value={ubc.nombre}>{ubc.nombre}</option>
                                        ))
                                      }
                                  </select>
                                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>
                              </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                        <button type="submit" className="px-6 py-2.5 bg-[#1c2d47] hover:bg-[#373a3f] text-white font-medium rounded-lg transition-colors">
                          {cargando ? "Guardando..." : "Guardar Producto"}
                        </button>
                        </div>
                    </form>
                    </div>
                </section>
            </div>  
        </>
  );
};

