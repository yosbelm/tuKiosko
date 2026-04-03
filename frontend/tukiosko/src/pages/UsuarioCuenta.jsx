import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { User, Mail, Phone, Calendar, Clipboard, DollarSign, Users, QrCode, Moon, Sun,Camera,CheckCircle2,XCircle, Copy, CopyIcon, CopyCheck, CopyPlus} from 'lucide-react';
import {getUsuario} from '../api/productos.api';
import {toast} from "sonner";


export default function UsuarioCuenta () {
  // Estado para el modo oscuro
  const [darkMode, setDarkMode] = useState(false);
  const [usuario, setUsuario] = useState([]);
  const [linkReferir, setLinkReferir] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(()=>{
    getUsuario()
    .then(response=>{
      setUsuario(response.data.usuario_datos)
      setLinkReferir(response.data.usuario_link)
    }).catch(error=>{
      console.log(`Error al obtener el usaurio ${error}`)
    })
  }, [])

  // Efecto para aplicar la clase al body o contenedor
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // const copiarAlPortapapeles = () => {
  //   if (linkReferir) {
  //     navigator.clipboard.writeText(linkReferir)
  //       .then(() => {
  //         toast.success('Enlace copiado', {
  //           description: `Se ha copiado el enlace de referido correctamente.`,
  //           duration: 3000,
  //       });
  //       })
  //       .catch(err => {
  //         console.error("Error al copiar: ", err);
  //       });
  //   }
  // };

  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText(linkReferir);
    setCopiado(true);
    toast.success('Enlace copiado', {
          description: `Se ha copiado el enlace de referido correctamente.`,
          duration: 3000,
      })
    setTimeout(() => setCopiado(false), 2000); // El icono vuelve a la normalidad tras 2 seg.
  };


  return (
    <div className={`transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : ' text-gray-800'} min-h-screen px-6 pt-2`}>
      
      {/* Header con Switch de Modo Oscuro */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {/* <div className="w-1 h-6 bg-[#1c2d47] dark:bg-[#1de9b6] rounded"></div> */}
          <h2 className="text-xl font-bold tracking-tight">Perfil de Administrador</h2>
        </div>
        
        <button 
          // onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
            darkMode 
            ? 'bg-slate-800 border-slate-700 text-yellow-400' 
            : 'bg-white border-gray-200 text-gray-600 shadow-sm'
          }`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="text-xs hidden md:flex font-bold uppercase tracking-wider">
            {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
          </span>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${darkMode ? 'bg-[#1de9b6]' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-1'}`}></div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-20">
        
        {/* Columna Izquierda: Foto y Datos Básicos */}
        <div className="lg:col-span-4 space-y-3">
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-sm flex flex-col items-center text-center`}>
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden  shadow-lg">
                  <div className="w-full h-full bg-[#1c2d47] flex items-center justify-center text-white">
                    <User className="w-16 h-16" />
                  </div>
              </div>
              <button className="absolute border-2 border-white bottom-1 right-1 p-2 bg-[#1c2d47] text-white rounded-full hover:bg-[#2a3e5d] transition-colors shadow-md">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h3 className="mt-4 text-2xl">{usuario.username}</h3>
            <span className={`mt-1 px-3 py-1 rounded-full text-[10px] ${darkMode ? 'bg-[#1de9b6]/20 text-[#1de9b6]' : 'bg-gray-200 text-black'}`}>
              {usuario.rol}
            </span>

            <div className="mt-6 w-full pt-6 border-t border-gray-200 dark:border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Estado</span>
                {!status ? (
                  <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> ACTIVO
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500 text-xs font-bold">
                    <XCircle className="w-4 h-4" /> INACTIVO
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Género</span>
                <span className="text-sm font-semibold capitalize">{usuario.genero}</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Referido (Consistente con RightColumn) */}
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} flex justify-between rounded-xl border p-4 shadow-sm`}>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1c2d47] text-white rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Código de Referido</p>
                  <p className="text-sm font-black tracking-widest">{usuario.codigo_referir}</p>
                </div>
             </div>
             <div className="w-10 h-10 text-gray-500 rounded-lg flex items-center justify-center">
             <button onClick={copiarAlPortapapeles}>
  {copiado ? (
    <CopyCheck className="w-6 h-5 text-green-500" />
  ) : (
    <Copy className="w-6 h-5 hover:text-blue-400" />
  )}
</button>
              </div>
          </div>
        </div>

        {/* Columna Derecha: Detalles del Contrato y Contacto */}
        <div className="lg:col-span-8 space-y-3">
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden shadow-sm`}>
            <div className="px-4 py-2 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#1c2d47] rounded"></div>
              <h3 className="text-gray-700 font-semibold">Información de Cuenta</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 dark:bg-[#1c2d47] bg-blue-900/20 text-white rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Correo Electrónico</p>
                  <p className="text-sm text-gray-700">{usuario.email?usuario.email:"No asignado"}</p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex items-start gap-4">
                <div className="p-3 dark:bg-[#1c2d47] bg-blue-900/20 text-white rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Teléfono de Contacto</p>
                  <p className="text-sm text-gray-700">No asignado</p>
                </div>
              </div>

              {/* Salario */}
              <div className="flex items-start gap-4">
                <div className="p-3 dark:bg-[#1c2d47] bg-blue-900/20 text-white rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Salario Base</p>
                  <p className="text-sm font-black text-green-500">${usuario.salario}</p>
                </div>
              </div>

              {/* Última Conexión */}
              <div className="flex items-start gap-4">
                <div className="p-3 dark:bg-[#1c2d47] bg-blue-900/20 text-white rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Último Ingreso</p>
                  <p className="text-sm text-gray-700">N/A</p>
                </div>
              </div>

              {/* Referido Por */}
              <div className="flex items-start gap-4">
                <div className="p-3 dark:bg-[#1c2d47] bg-blue-900/20 text-white rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Referido por</p>
                  <p className="text-sm text-gray-700">{usuario.referido_por || 'Registro Directo'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Acción */}
          {/* <div className="flex justify-end gap-3">
            <button className="px-6 py-3 bg-[#1c2d47] text-white text-xs font-bold rounded-xl hover:bg-[#2a3e5d] transition-all shadow-md uppercase tracking-widest shadow-[#1c2d47]/20">
               Editar Perfil
             </button>
             <button className="px-6 py-3 bg-[#1c2d47] text-white text-xs font-bold rounded-xl hover:bg-[#2a3e5d] transition-all shadow-md uppercase tracking-widest shadow-[#1c2d47]/20">
               Cambiar Contraseña
             </button>
          </div> */}
        </div>

      </div>
    </div>
  );
};

