import { useEffect, useState, useMemo } from "react";
import { X, Search, Package, Plus, Minus, CheckCircle } from 'lucide-react';
import { getAllProducts, postNuevaCantidad, getAllAreas } from '../api/productos.api';

export default function Incrementarinventario({ onClose }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [productos, setProductos] = useState([]);
    const [idProducto, setIdProducto] = useState("");
    const [cantidadActualProducto, setCantidadActualProducto] = useState(0);
    const [ubicacion, setUbicacion] = useState("");
    const [definirUbicacion, setDefinirUbicacion] = useState("");
    
    // Estados para la lógica de incremento
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newQuantity, setNewQuantity] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts();
                setProductos(response.data);                
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        async function allAreas (){
        await getAllAreas()
            .then(response => {
                setUbicacion(response.data);
            })
            .catch(error => {
                console.error('Error al obtener areas:', error);
            }); 
        };
        allAreas();
    }, [])

   
    const actualizarProducto = async (id) => {
        console.log('se le dio click')
        try {
            const payload = {
                "cantidad": newQuantity,
                "area": definirUbicacion
            }
            await postNuevaCantidad(id, payload);
            
            toast.success('Producto actualizado', {
                description: `Se ha actualizado el producto correctamente.`,
                duration: 3000,
            });
            setSearchTerm("");
            // cantidadActualProducto(cantidadActualProducto+newQuantity)
            setSelectedProduct(null);
        } catch (error) {
            toast.error('Ha occurrido un error', {
                description: `${error}.`,
                duration: 3000,
            });
            console.error("Error al obtener productos:", error);
        }
    };
    // actualizarProducto();
    

    const searchResults = useMemo(() => {
        if (searchTerm.trim() === "") return [];
        return productos.filter(
            (product) =>
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, productos]);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setDefinirUbicacion(product.ubicacion);
        setIdProducto(product.id);
        setCantidadActualProducto(product.cantidad);
        setSearchTerm(product.nombre);
        setShowDropdown(false);
        setNewQuantity(0); // Resetear a 1 al cambiar de producto
    };

    const handleQuantityChange = (val) => {
        const num = parseInt(val);
        if (isNaN(num)) setNewQuantity(0);
        else setNewQuantity(Math.max(0, num)); // Evita negativos
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-lg animate-in zoom-in-95 duration-200">
                
                {/* Botón Cerrar */}
                <button onClick={onClose} className="absolute top-3 right-3 z-10 p-1.5 transition-transform hover:scale-110">
                    <div className="flex justify-center w-6 h-6 items-center rounded-full bg-[#1c2d47]/10 text-[#1c2d47] hover:bg-[#1c2d47] hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </div>
                </button>

                {/* Header */}
                <div className="rounded-t-xl px-4 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900">Actualizar Producto</h2>
                    {/* <p className="text-[11px] text-start text-gray-400 font-medium italic">
                        Agrega la cantidad que entro de este producto a tu kiosko.
                    </p> */}
                </div>

                <div className="p-5 space-y-6">
                    {/* Buscador */}
                    <div className="relative">
                        <label className="text-sm font-medium text-black">Producto</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Escribe el nombre..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2d47]/20 focus:border-[#1c2d47] transition-all"
                            />
                        </div>

                        {/* Dropdown de Resultados */}
                        {showDropdown && searchTerm.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    searchResults.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleSelectProduct(product)}
                                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-50 last:border-none transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#1c2d47] rounded-lg flex items-center justify-center text-white">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-gray-700">{product.nombre}</span>
                                            </div>
                                            <span className="text-xs font-bold text-[#1c2d47] px-2 py-1 bg-white border border-gray-200 rounded-md shadow-sm">
                                                {product.ubicacion}: {product.cantidad}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-400 text-sm">No hay resultados</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Selector de Cantidad (Solo visible si hay producto seleccionado) */}
                    {selectedProduct && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 animate-in slide-in-from-top-2 duration-300">
                            <div className="pb-4">
                                <label className="text-sm font-medium text-gray-600">Cambiar ubicación</label>
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

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-600">Cantidad a incrementar:</span>
                                <div className="text-xs font-bold text-[#1c2d47] px-2 py-1 bg-white border border-gray-200 rounded-md shadow-sm">
                                    Actual: {cantidadActualProducto}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center gap-4">
                                <button 
                                    onClick={() => handleQuantityChange(newQuantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <Minus className="w-4 h-4 text-gray-600 font-bold" />
                                </button>
                                
                                <input 
                                    type="number"
                                    value={newQuantity}
                                    onChange={(e) => handleQuantityChange(e.target.value)}
                                    className="w-14 text-center font-medium text-[#111827]"
                                />

                                <button 
                                    onClick={() => handleQuantityChange(newQuantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4 text-gray-600 font-bold" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 flex gap-3">
                    {/* <button 
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button> */}
                    <button 
                        disabled={!selectedProduct}
                        onClick={()=>{actualizarProducto(idProducto)}}
                        className={`flex-2 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                            selectedProduct 
                            ? 'bg-[#1c2d47] text-white hover:bg-[#414a59] shadow-md' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    );
}