import { postNuevaCategoria, getAllCategorias } from "../api/productos.api"
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import { BookmarkCheck, CatIcon, ListChevronsDownUpIcon, Save } from "lucide-react";


export default function AgregarCategoria(){
    const [nombre, setNombre] = useState("");
    const [cargando, setCargando] = useState(false);
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([])

    const agregarCategoria = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return alert("El nombre es requerido");
        setCargando(true);
        console.log({ nombre: nombre })
        try {
            const nueva_categoria = { nombre: nombre }
            await postNuevaCategoria(nueva_categoria);
            toast.success('Categoría creada correctamente', {
                description: `Se ha añadido "${nombre}" a la lista.`,
                duration: 3000,
            });
            setCategoriasDisponibles([...categoriasDisponibles, nueva_categoria]);
            setNombre("");
        } catch (error) {
            console.error("Error al crear categoria:", error);
            toast.error('Limite alcanzado', {
                description: `Ha llegado al limite de categorias.`,
                duration: 3000,
            });
        } finally {
            setCargando(false);
        }
    };

    useEffect(()=>{
        getAllCategorias()
        .then(response => {
            setCategoriasDisponibles(response.data);
            console.log(response.data);
        }
        ).catch(error => {
            console.error('Error al obtener categorias:', error);
        });
    }, [])

    return(
        <div className="p-4 lg:p-6 lg:pt-2">
            <section className="animate-in fade-in duration-300">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Crear Nueva Categoría</h2>
                        {/* <p className="text-sm text-gray-500 mt-1">Define las ubicaciones para tus productos</p> */}
                    </div>
                    <form className="p-6 space-y-6" onSubmit={agregarCategoria}>
                        <div className="space-y-1">
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Nombre de la Categoría</span>
                                <span className="text-xs text-gray-400">Requerido</span>
                            </label>
                            <div className="relative">
                                <input 
                                type="text" 
                                placeholder="Ej: Bebidas"
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
                            <label className="text-sm font-medium text-gray-700">Categorías</label>
                            <div className="flex flex-wrap items-center gap-2 p-3 py-1 bg-gray-50 border border-gray-200 rounded-lg min-h-13">
                                {categoriasDisponibles.map((miembro) => (
                                <span key={miembro.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-full shadow-sm animate-in zoom-in duration-200">
                                    <BookmarkCheck className="w-5 h-5 rounded-full" />
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
                                placeholder={categoriasDisponibles.length >= 5 ? "Límite alcanzado" : "Lista de categorías"}
                                className="flex-1 min-w-30 bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400 disabled:cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Agrega hasta 8 categorías</p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-4">
                            <button 
                                type="submit" 
                                disabled={cargando}
                                className="flex items-center justify-center gap-2 w-full lg:w-[50%] md:w-[50%] px-6 py-2.5 bg-[#1c2d47] 
                                hover:bg-[#373a3f] text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                            >
                            <Save className="w-4 h-4" />
                            {cargando ? "Guardando..." : "Guardar Categoría"}
                            </button>
                            {/* <button type="reset" className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-200 transition-colors">Cancelar</button> */}
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}