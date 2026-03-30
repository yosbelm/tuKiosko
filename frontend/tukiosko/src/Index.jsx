import React, { useEffect, useState } from 'react';

import StatCard from './components/StatCard.jsx'
import UserRow from './components/UserRow.jsx'
import IconWidget from './components/IconWidget.jsx'
import SocialCard from './components/SocialCard.jsx'
import RightColumn from './components/RightColumn.jsx'
import { getAllProducts, getAllVentas } from './api/productos.api.js';
import fechaFinal from '../utils/Date.js'
import { Briefcase, BarChart3, Wallet, Users, Bell, ChevronDown, Search, ChartLine, Timer, MenuIcon, Workflow } from "lucide-react"
import { Link, useOutletContext } from 'react-router-dom';



function Index() {
  const [productos, setProductos] = useState([])
  const [ventas, setVentas] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [productosVendidos, setProductosVendidos] = useState([])
  const [dineroVentasDiarias, setDineroVentasDiarias] = useState([])
  const [cantidadVentasDiarias, setCantidadVentasDiarias] = useState([])
  const [dineroVentasSemanal, setDineroVentasSemanal] = useState([])
  const [cantidadVentasSemanal, setCantidadVentasSemanal] = useState([])
  const [dineroVentasMensual, setDineroVentasMensual] = useState([])
  const [cantidadVentasMensual, setCantidadVentasMensual] = useState([])
  const [cantidadProductos, setCantidadProductos] = useState([])
  

  useEffect(() => {
    getAllProducts()
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      }); 

      getAllVentas()
        .then(response => {
          setVentas(response.data.ventas_diarias);
          console.log(response.data.ventas_diarias)
          setVendedores(response.data.vendedores)
          setProductosVendidos(response.data.productos_vendidos);
          console.log(response.data.productos_vendidos)

          setDineroVentasDiarias(response.data.dinero_ventas_diarias)
          setCantidadVentasDiarias(response.data.productos_vendidos_dia)

          setDineroVentasSemanal(response.data.dinero_ventas_semanal)
          setCantidadVentasSemanal(response.data.productos_vendidos_semana)

          setDineroVentasMensual(response.data.dinero_ventas_mensual)
          setCantidadVentasMensual(response.data.productos_vendidos_mes)
          setCantidadProductos(response.data.total_productos_conteo)
          console.log(response.data.productos_vendidos)
        })
        .catch(error => {
          console.error('Error al obtener ventas:', error);
      });
  }, []);
  

  return (
      <>        
          {/* Dashboard Content */}
          <div className="p-4 lg:p-6 lg:pt-2">
            {/* Sales Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
              <StatCard title="Ventas Diarias" icon={<Wallet className="w-6 h-6" />} iconBg="bg-green-500" 
                value={dineroVentasDiarias} cantidad={cantidadVentasDiarias} color="bg-[#00ead0]" trend="up" />

              <StatCard title="Ventas Semanales" icon={<Briefcase className="w-6 h-6" />}
                iconBg="bg-blue-500" value={dineroVentasSemanal} cantidad={cantidadVentasSemanal} color="bg-[#9182f2]" trend="down" />
              
              <Link to="/productos-lista" className="block cursor-pointer">
                <StatCard title="Productos" icon={<BarChart3 className="w-6 h-6" />}
                  iconBg="bg-gray-600" value="Productos de este kiosko" cantidad={cantidadProductos} color="bg-[#1de9b6]" trend="up" />
              </Link>

              <Link to="/agregar-producto" className="block cursor-pointer">
                <StatCard title="Vendedores" icon={<Workflow className="w-6 h-6" />}
                  iconBg="bg-slate-800" value="Vendedores de este kiosko" cantidad={vendedores} color="bg-[#1de9b6]" trend="up" />
              </Link>
            </div>

            {/* <h1 className="font-bold text-2xl mb-1">Historial</h1> */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-6">
              {/* Recent Users Table */}
              <div className="lg:col-span-7 bg-white rounded-lg shadow-sm max-h-127 overflow-auto scrollbar-hide">
                <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-1 h-5 bg-[#1c2d47] rounded"></div>
                  <h3 className="text-gray-700 font-semibold">Ventas Recientes</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-50">
                      {ventas.map(venta =>(
                        <Link to={`/ventas/${venta.id}/`}>
                          <UserRow key={venta.id} name={venta.vendedor_nombre} precio={venta.precio_total} cantidad={venta.cantidad}
                          seed={venta.vendedor_genero} date={fechaFinal(venta.creado)} status="online" />
                        </Link>
                        ))
                      }
                      {/* <UserRow name="Ida Jorgensen" seed="Ida" date="19 MAY 12:56" status="offline" /> */}
                    </tbody>
                  </table>
                </div>
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

              {/* Right Column Widgets */}
              <div className="lg:col-span-5 space-y-1 max-h-127 overflow-auto scrollbar-hide relative pb-2">
                <div className="bg-white rounded-lg shadow-sm p-0 overflow-x-auto scrollbar-thin">
                  <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 sticky left-0">
                      <div className="w-1 h-5 bg-[#1c2d47] rounded"></div>
                      <h3 className="text-gray-700 font-semibold whitespace-nowrap">Productos Vendidos</h3>
                  </div>
                </div>
                {productosVendidos.map(pv =>(
                  <RightColumn key={pv.id} precio={pv.precio} cantidad={pv.cantidad_total} producto={pv.nombre} 
                  creado={pv.creado}/>
                ))}
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

            {/* Social Media */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SocialCard icon="fa-facebook-f" color="text-blue-600" count="12,281" trend="+7.2%" />
              <SocialCard icon="fa-twitter" color="text-sky-400" count="11,200" trend="+6.2%" />
              <SocialCard icon="fa-google-plus-g" color="text-red-500" count="10,500" trend="+5.9%" />
            </div> */}
          </div>
      </>
  );
}

export default Index;