import { AlertTriangle, Calendar1, Camera, Megaphone, SendHorizonalIcon, X } from "lucide-react";
import {getAvisos, postNuevoAviso, deleteAviso} from '../api/productos.api'
import { useEffect, useState } from "react";
import {fechaCorta} from '../../utils/FechaCorta'
import {toast} from "sonner";


export default function Avisos(){
    const [avisos, setAvisos] = useState([]);
    const [descripcion, setDescripcion] = useState("");
    const [prioridad, setPrioridad] = useState("baja");
    const [cargando, setCargando] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [avisoToDelete, setAvisoToDelete] = useState("")

    useEffect(() =>{
        getAvisos()
        .then((response)=>{
            setAvisos(response.data);
        }).catch((error)=>{
            console.log(error)
        })
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!descripcion.trim()) return;
        setCargando(true);
        try {
            const payload = {
                descripcion: descripcion,
                prioridad: prioridad
            };
            const nuevo_aviso = await postNuevoAviso(payload);
            toast.success(`Aviso creado`, {
                description: `Se ha creado un aviso satisfactoriamente.`,
                duration: 3000,
            });
            console.log(`este es el nuevo aviso publicado ${nuevo_aviso}`)
            setAvisos([...avisos, nuevo_aviso.data]);
            setDescripcion("");
            setPrioridad("baja");
        } catch (error) {
            console.error("Error al crear aviso:", error);
            toast.error(`Aviso no creado`, {
                description: `Ha ocurrido un error al crear el aviso.`,
                duration: 3000,
            });
        } finally {
            setCargando(false);
        }
    };

    const confirmDelete = (aviso) => {
        setAvisoToDelete(aviso);
        setShowDeleteModal(true);
      };
    
    const handleConfirmDelete = async () => {
        if (!avisoToDelete) return;
        try {
          await deleteAviso(avisoToDelete.id);
          toast.success(`Se eliminó el aviso`, {
            description: `Se ha eliminado el aviso satisfactoriamente.`,
            duration: 3000,
          });
          setAvisos((prev) => prev.filter((item) => item.id !== avisoToDelete.id));
        } catch (error) {
          toast.error("Error al eliminar el aviso");
        } finally {
          setShowDeleteModal(false);
          setProductToDelete(null);
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
        <div className="p-4 lg:p-6 lg:pt-2 pb-26">
            <div className="flex justify-center">
                <section className="flex justify-center w-full items-center flex-col gap-3">
                    <form onSubmit={handleSubmit} className="w-full lg:max-w-115 md:max-w-87.5 sm:max-w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="relative flex items-center px-6 py-3 border-b border-gray-200 gap-2">
                            <div className="flex items-center justify-center rounded-full bg-gray-300 border border-gray-200 w-7 h-7">
                                <Megaphone className="w-4 h-4 font-bold text-[#1c2d47]" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Título del Aviso</h2>
                        </div>
                        <div className="px-6 lg:px-12 py-2 pb-6">
                            <div className="pb-3">
                                <label className="text-sm font-medium text-gray-700">Tipo de aviso</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                                    <AlertTriangle className="w-4 h-4" />
                                    </span>
                                    <select 
                                        name="zona" value={prioridad}
                                        onChange={(e) => setPrioridad(e.target.value)} 
                                        className="w-full pl-12 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="baja">Prioridad Baja</option>
                                        <option value="media">Prioridad Media</option>
                                        <option value="alta">Prioridad Alta</option>\
                                    </select>
                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="pt-0">
                                <label className="text-sm font-medium text-gray-700">Descripción</label>
                                <div className="relative mr-0 pt-0">
                                    {/* <AlertOctagonIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                                    <textarea
                                        type="text"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        placeholder="Escribe el aviso para los vendedores..."
                                        className="w-full pl-4 pr-14 py-2 bg-white border rounded-xl border-gray-300 text-gray-900 
                                        focus:outline-none focus:ring-1  focus:ring-[#1c2d47]/0 focus:border-[#1c2d47] transition-all"
                                    />
                                    <button type="submit" disabled={cargando}
                                        className="absolute right-1/20 top-3/5 -translate-y-1/2 p-1.5 bg-[#1c2d47] text-white rounded-full hover:bg-[#2a3e5d] transition-colors shadow-md">
                                        <SendHorizonalIcon className=" w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {avisos.map(aviso=>{
                        const estilo = configPrioridad[aviso.prioridad] || configPrioridad.baja;
                        return(
                            <div key={aviso.id} className="w-full lg:max-w-115 md:max-w-87.5 sm:max-w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm ">
                                <div className="relative flex justify-between items-center px-6 py-3 border-b border-gray-200 gap-2">
                                    <div className="flex justify-between items-center gap-2">
                                        <div className={`flex items-center justify-center rounded-full border w-7 h-7 ${estilo.bg} ${estilo.borde}`}>
                                            <h1 className={`font-bold ${estilo.texto}`}>
                                                {estilo.simbolo}
                                            </h1>
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">Prioridad {aviso.prioridad}</h2>
                                    </div>
                                    <div className="flex justify-center items-center gap-1 text-[12px] text-gray-500">
                                        <Calendar1 className="w-3 h-3" />
                                        {fechaCorta(aviso.creacion)}
                                    </div>
                                    <button onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(aviso);
                                    }} className="absolute p-1 -top-1 -right-1 rounded-full bg-red-200">
                                        <X className="w-3 h-3 font-bold text-red-500"/>
                                    </button>
                                </div>
                                <div className="text-sm px-6 py-2">
                                    {aviso.descripcion}
                                </div>
                                <div className="flex justify-between px-6 py-3">
                                    <div className="flex justify-center items-center gap-2">
                                        <p className="text-center text-gray-500">{aviso.creado_por}</p>
                                    </div>
                                    <div className="">
                                    {/* <div className="flex -space-x-3"> 
                                        {avatars.map((avatar) => (
                                            <div
                                                key={avatar.id}
                                                className="inline-block h-8 w-8 rounded-full ring-1 ring-white shadow-sm overflow-hidden"
                                                >
                                                <img
                                                    className="h-full w-full object-cover bg-gray-200 aspect-square"
                                                    src={avatar.src}
                                                    alt={avatar.alt}
                                                />
                                            </div>
                                        ))}
                                    </div> */}
                                    <div className="flex -space-x-2">
                                        {aviso.visto_por && aviso.visto_por.map((username, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-[#1c2d47] shadow-sm overflow-hidden"
                                                title={username} // Muestra el nombre completo al pasar el mouse
                                            >
                                                <span className="text-white text-xs font-bold uppercase">
                                                    {username.charAt(0)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    </div>
                                </div>
                            </div>
                    )})}
                </section>
            </div>
            {/* Modal de Confirmación */}
            {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ¿Confirmar eliminación?
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                    Estás a punto de eliminar este aviso<span className="font-semibold text-gray-800"></span>. 
                    Esta acción no se puede deshacer.
                    </p>
    
                    <div className="flex gap-3">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        className="flex-1 px-4 py-2 bg-red-200 text-red-500 hover:bg-red-700 hover:text-white rounded-lg font-medium transition-colors"
                    >
                        Eliminar ahora
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>
    )
}