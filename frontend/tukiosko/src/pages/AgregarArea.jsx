import { postNuevaArea, getAllAreas } from "../api/productos.api"
import { useEffect, useState } from "react";
import { toast } from 'sonner';


export default function AgregarArea(){
    const [nombre, setNombre] = useState("");
    const [cargando, setCargando] = useState(false);
    const [areasDisponibles, setAreasDisponibles] = useState([])

    const agregarArea = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return alert("El nombre es requerido");
        setCargando(true);
        console.log({ nombre: nombre })
        try {
            await postNuevaArea({ nombre: nombre });
            toast.success('Área creada correctamente', {
                description: `Se ha añadido "${nombre}" a la lista.`,
                duration: 3000,
            });
            setNombre("");
        } catch (error) {
            console.error("Error al crear área:", error);
            alert("Hubo un error al guardar");
        } finally {
            setCargando(false);
        }
    };

    useEffect(()=>{
        getAllAreas()
        .then(response => {
            setAreasDisponibles(response.data);
            console.log(response.data);
        }
        ).catch(error => {
            console.error('Error al obtener areas:', error);
        });
    }, [])

    return(
        <div className="p-4 lg:p-6 lg:pt-2">
            <section className="animate-in fade-in duration-300">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Crear Nueva Área</h2>
                        {/* <p className="text-sm text-gray-500 mt-1">Define las ubicaciones para tus productos</p> */}
                    </div>
                    <form className="p-6 space-y-6" onSubmit={agregarArea}>
                        <div className="space-y-1">
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Nombre del Área</span>
                                <span className="text-xs text-gray-400">Requerido</span>
                            </label>
                            <div className="relative">
                                <input 
                                type="text" 
                                placeholder="Ej: Almacén"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        {/* <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Descripción</label>
                            <textarea 
                                rows="3"
                                placeholder="Descripción del área..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none resize-none transition-all"
                            ></textarea>
                        </div> */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Áreas de Ventas</label>
                            <div className="flex flex-wrap items-center gap-2 p-3 py-1 bg-gray-50 border border-gray-200 rounded-lg min-h-13">
                                {areasDisponibles.map((miembro) => (
                                <span key={miembro.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-full shadow-sm animate-in zoom-in duration-200">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Jack`} alt="" className="w-5 h-5 rounded-full" />
                                    {miembro.nombre}
                                    <button 
                                    type="button" 
                                    // onClick={() => eliminarMiembro(miembro.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                    ×
                                    </button>
                                </span>
                                ))}
                                <input 
                                type="text" 
                                disabled
                                placeholder={areasDisponibles.length >= 3 ? "Límite alcanzado" : "Lista de áreas"}
                                className="flex-1 min-w-30 bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400 disabled:cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Agrega hasta 3 áreas</p>
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                            <button 
                                type="submit" 
                                disabled={cargando}
                                className="px-6 py-2.5 bg-[#1c2d47] hover:bg-[#373a3f] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                            {cargando ? "Guardando..." : "Guardar Área"}
                            </button>
                            {/* <button type="reset" className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-200 transition-colors">Cancelar</button> */}
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}