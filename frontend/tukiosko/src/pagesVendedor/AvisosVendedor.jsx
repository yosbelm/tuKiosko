import { AlertTriangle, Calendar1, Camera, Check, CheckCheck, CheckCircle, Megaphone, SendHorizonalIcon } from "lucide-react";
import {getAvisos} from '../api/productos.api'
import { useEffect, useState } from "react";
import {fechaCorta, fechaDetallada} from '../../utils/FechaCorta'
import {patchAvisoLeido, patchTodosAvisoLeido} from '../api/productos.api'
import {useResolvedPath} from 'react-router-dom'


export default function AvisosVendedor(){
    const [avisos, setAvisos] = useState([]);
    const [leidos, setLeidos] = useState([]);

    useEffect(() => {
        const inicializarAvisos = async () => {
            try {
                await patchTodosAvisoLeido();
                const response = await getAvisos();
                setAvisos(response.data);
            } catch (error) {
                console.error("Error al procesar avisos:", error);
            }
        };
        inicializarAvisos();
    }, []);

    useEffect(() =>{
        getAvisos()
        .then((response)=>{
            const avisosActualizados = response.data.map(a => ({...a, leido: true}));
            setAvisos(avisosActualizados);
            setLeidos(response.data.visto_por)
        }).catch((error)=>{
            console.log(error)
        })
    }, [])

    const manejarLectura = async (avisoId) => {
        try {
            await patchAvisoLeido(avisoId);             
            setAvisos(prevAvisos => 
                prevAvisos.map(a => 
                    a.id === avisoId ? { ...a, leido: true } : a
                )
            );
        } catch (error) {
            console.error("Error al marcar como leído", error);
        }
    };

    
    const configPrioridad = {
        baja: {
            bg: "bg-blue-100",
            texto: "text-blue-600",
            borde: "border-blue-200",
            simbolo: "!"
        },
        media: {
            bg: "bg-yellow-100",
            texto: "text-yellow-600",
            borde: "border-yellow-200",
            simbolo: "!!"
        },
        alta: {
            bg: "bg-red-100",
            texto: "text-red-600",
            borde: "border-red-200",
            simbolo: "!!!"
        }
    };

    return(
        <div className="lg:p-6 lg:pt-2 pb-26">
            <div className="flex justify-center">
                <section className="flex justify-center w-full items-center flex-col gap-3">
                    
                    {avisos ? (avisos.map(aviso=>{
                        const estilo = configPrioridad[aviso.prioridad] || configPrioridad.baja;
                        return(
                            <div key={aviso.id} className="w-full lg:max-w-115 md:max-w-87.5 sm:max-w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm ">
                                <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 gap-2">
                                    <div className="flex justify-between items-center gap-2">
                                        <div className={`flex items-center justify-center rounded-full border w-7 h-7 ${estilo.bg} ${estilo.borde}`}>
                                            <h1 className={`font-bold ${estilo.texto}`}>
                                                {estilo.simbolo}
                                            </h1>
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">Prioridad {aviso.prioridad}</h2>
                                    </div>
                                    <div
                                        key={aviso.id}
                                        className="flex items-center justify-center h-5 w-5 rounded-full ring-2 ring-white bg-[#1c2d47] shadow-sm overflow-hidden"
                                        >
                                        <span className="text-white text-xs font-bold uppercase">
                                            {aviso.creado_por.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm px-6 py-2">
                                    {aviso.descripcion}
                                </div>
                                <div className="flex justify-between px-6 py-3">
                                    <div className="flex justify-center items-center gap-2">
                                        {/* <p className="text-center text-gray-500">{aviso.creado_por}</p> */}
                                        <div className="flex justify-center items-center gap-1 text-[12px] text-gray-500">
                                            <Calendar1 className="w-3 h-3" />
                                            {fechaDetallada(aviso.creacion)}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <button 
                                        // onClick={() => !aviso.leido && manejarLectura(aviso.id)} 
                                        className="flex gap-1 justify-center items-center text-[11px] px-3 py-1 rounded-xl shadow-sm">
                                            {!aviso.leido?<Check className="w-4 h-4 text-gray-600" />:<CheckCheck className="w-4 h-4 text-green-600" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                    )})) : 
                    (<div className="w-full lg:max-w-115 md:max-w-87.5 sm:max-w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm ">
                        No hay
                    </div>)
                    }
                </section>
            </div>
        </div>
    )
}