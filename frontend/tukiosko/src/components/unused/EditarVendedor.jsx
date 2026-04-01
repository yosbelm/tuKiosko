import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getAllVendedores, postNuevoVendedor } from '../../api/productos.api.js';
import { KeyIcon, KeyRoundIcon } from 'lucide-react';
import { toast } from 'sonner';


export default function AgregarVendedor(){
    const [equipoVentas, setEquipoVentas] = useState([
    // { id: 'jack', nombre: 'Jack', seed: 'Jack' },
    // { id: 'ann', nombre: 'Ann', seed: 'Ann' }
    ]);
    const [cargando, setCargando] = useState(false);
    const [nuevoMiembro, setNuevoMiembro] = useState('');
    const [nombreVendedor, setNombreVendedor] = useState("");
    const [passwordVendedor, setPasswordVendedor] = useState("");
    const [salario, setSalario] = useState(0);
    const [genero, setGenero] = useState("");

    useEffect(() => {
        const fetchVendedores = async () => {
            try {
                const response = await getAllVendedores();
                setEquipoVentas(response.data);
            } catch (error) {
                console.error('Error al obtener vendedores:', error);
            }
        };    
        fetchVendedores();
    }, []);

    const agregarSeller = async (e) => {
        e.preventDefault();
        if (!nombreVendedor.trim()) return alert("El nombre es requerido");
        setCargando(true);
        console.log({ username: nombreVendedor, salario: salario, password: passwordVendedor })
        try {
            await postNuevoVendedor({ 
                username: nombreVendedor,
                password: passwordVendedor,
                salario: salario,
                genero: genero
            });
            const nuevoVendedorUpdate = {
                nombre: nombreVendedor,
                genero: genero
            }
            toast.success('Vendedor agregado correctamente', {
                description: `Se ha añadido "${nombreVendedor}" a la lista de vendedores.`,
                duration: 3000,
            });
            setNombreVendedor("");
            setPasswordVendedor("");
            setGenero("");
            setSalario(0)
            setEquipoVentas([...equipoVentas, nuevoVendedorUpdate]);
        } catch (error) {
            console.error("Error al crear el vendedor:", error);
            alert("Hubo un error al guardar");
        } finally {
            setCargando(false);
        }
    };
    

    
    // Manejar eliminación de chips
    const eliminarMiembro = (id) => {
    setEquipoVentas(equipoVentas.filter(miembro => miembro.id !== id));
    };
    
    // Manejar agregar miembro al presionar Enter
    const agregarMiembro = (e) => {
    if (e.key === 'Enter' && nuevoMiembro.trim() !== '') {
        e.preventDefault();
        if (equipoVentas.length < 5) {
        const nuevo = {
            id: Date.now().toString(),
            nombre: nuevoMiembro,
            seed: nuevoMiembro,
        };
        setEquipoVentas([...equipoVentas, nuevo]);
        setNuevoMiembro('');
        }
    }
    };

    return(
        <div className="p-4 lg:p-6 lg:pt-2">
            <section className="animate-in fade-in duration-300">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Registrar Vendedor</h2>
                        <p className="text-sm text-gray-500 mt-1">Asigna usuarios como vendedores</p>
                    </div>
            
                    <form className="p-6 space-y-6" onSubmit={agregarSeller}>
                        {/* Selección de Usuario */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Usuario</label>
                            <div className="relative">
                                <div className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder`} 
                                        alt="Avatar" 
                                        className="w-8 h-8 rounded-full bg-gray-200"
                                    />
                                    
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Pedro"
                                        value={nombreVendedor}
                                        onChange={(e) => setNombreVendedor(e.target.value)}
                                        className="w-full px-4 py-1 bg-gray-50 border-none rounded-lg focus:ring-0.5 focus:ring-blue-500/10 focus:border-none outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Contraseña</label>
                            <div className="relative">
                                <div className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all">
                                    <KeyRoundIcon className="w-4 h-4"/>                                    
                                    <input 
                                        type="text" 
                                        placeholder="***********"
                                        value={passwordVendedor}
                                        onChange={(e) => setPasswordVendedor(e.target.value)}
                                        className="w-full px-4 py-1 bg-gray-50 border-none rounded-lg focus:ring-0.5 focus:ring-blue-500/10 focus:border-none outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Género</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🚹</span>
                                <select 
                                    name="zona" value={genero}
                                    onChange={(e) => setGenero(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 appearance-none cursor-pointer transition-all"
                                >
                                    <option value="">Seleccionar género...</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>\
                                </select>
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
            
                        {/* Múltiples usuarios (chips) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Equipo de Ventas</label>
                            <div className="flex flex-wrap items-center gap-2 p-3 py-1 bg-gray-50 border border-gray-200 rounded-lg min-h-13">
                                {equipoVentas.map((miembro) => (
                                <span key={miembro.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-full shadow-sm animate-in zoom-in duration-200">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${miembro.genero === 'femenino' ? 'Jack' : 'Ann'}`} alt="" className="w-5 h-5 rounded-full" />
                                    {miembro.nombre}
                                    <button 
                                    type="button" 
                                    onClick={() => eliminarMiembro(miembro.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                    ×
                                    </button>
                                </span>
                                ))}
                                <input 
                                type="text" 
                                disabled
                                value={nuevoMiembro}
                                // onChange={(e) => setNuevoMiembro(e.target.value)}
                                // onKeyDown={agregarMiembro}
                                placeholder={equipoVentas.length >= 5 ? "Límite alcanzado" : "Lista de vendedores"}
                                className="flex-1 min-w-30 bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400 disabled:cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Agrega hasta 5 usuarios</p>
                        </div>

                        {/* Salario */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Salario del Vendedor</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">$</span>
                                <input 
                                type="number" 
                                value={salario} 
                                onChange={(e) => setSalario(e.target.value)}
                                placeholder="0"
                                min="0"
                                max="100000"
                                className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-all outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
            
                        {/* Notas */}
                        {/* <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Notas Adicionales</span>
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-xs cursor-help" title="Máximo 200 caracteres">?</span>
                        </label>
                        <textarea 
                            rows="3"
                            maxLength="200"
                            placeholder="Información adicional sobre el vendedor..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 resize-none outline-none focus:border-blue-500"
                        ></textarea>
                        </div> */}
            
                        {/* Botones */}
                        <div className="flex items-center gap-3 pt-4">
                        <button type="submit" className="px-6 py-2.5 bg-[#1c2d47] hover:bg-[#373a3f] text-white font-medium rounded-lg transition-colors shadow-sm">
                            {cargando ? "Guardando..." : "Registrar Vendedor"}
                        </button>
                        {/* <button type="reset" className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-200 transition-colors">
                            Cancelar
                        </button> */}
                        </div>
                    </form>
                    </div>
            </section>
        </div>
    )
}