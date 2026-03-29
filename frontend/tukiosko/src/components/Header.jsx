import { Briefcase, BarChart3, Wallet, Users, Bell, ChevronDown, Search, ChartLine, Timer, MenuIcon, Workflow } from "lucide-react"
import React, { useEffect, useState } from "react";
import { Link, useOutletContext, useResolvedPath } from 'react-router-dom';
import { getAllProducts } from "../api/productos.api";



export default function Header({toggle}){
    const urlDirection = useResolvedPath();
    const url = urlDirection.pathname;
    const [urlFinal, setUrlFinal] = useState("")
    console.log(url.split("/")[1])

    useEffect(()=>{
      if(url === '/agregar-area'){
        setUrlFinal(" Agregar Area /")
      }else if (url === '/agregar-vendedor'){
        setUrlFinal(" Agregar Vendedores /")
      }else if (url === '/agregar-producto'){
        setUrlFinal(" Agregar Productos /")
      } else if (url === '/agregar-compra'){
        setUrlFinal(" Agregar Compra /")
      } else if (url === '/productos-lista'){
        setUrlFinal(" Lista Productos /")
      }else if (url.split("/")[1] === 'producto-detalles'){
        setUrlFinal(" Detalles Producto /")
      } else{
        setUrlFinal(" Panel ")
      }
    }, [url])

    return(
        <header className="sticky top-0 z-40">
            <div className="flex items-center justify-between pl-4 pr-8 pb-0 py-4">
              <div className="flex items-center gap-4">
                <button onClick={toggle} className="md:hidden text-gray-600 hover:text-gray-800">
                  {/* <i className="fas fa-bars text-xl"></i> */}
                  <MenuIcon className='w-4 h-4' />
                </button>
                <button className="hidden sm:block text-gray-400 hover:text-gray-600">
                  <i className="fas fa-expand"></i>
                </button>
                <div className="flex items-center justify-center gap-2 text-gray-600 cursor-pointer">
                  <Link to={"/"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>
                  </Link>

                  <span className="font-medium" style={{fontSize: 13}}>/ {urlFinal}</span>
                  <ChevronDown className="w-4 h-4 text-xs" />
                </div>
                {/* <button className="text-gray-400 hover:text-gray-600">
                  <Search className="w-4 h-4" />
                </button> */}
              </div>
              <div className="flex items-center gap-4">
                <button className="relative text-gray-400 hover:text-gray-600">
                  <Bell className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 flex items-center gap-1">
                  {/* <i className="fas fa-cog"></i> */}
                  <Users className="w-4 h-4"/>
                  <ChevronDown className="w-4 h-4 text-xs" />
                </button>
              </div>
            </div>
          </header>
    )
}