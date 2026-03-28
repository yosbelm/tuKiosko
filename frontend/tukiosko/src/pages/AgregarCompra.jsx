import { useState, useMemo, useEffect } from "react"
import { Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle, X, Package } from "lucide-react"
import { getAllProducts, postVenta } from '../api/productos.api'
import { toast } from "sonner"



export default function POSPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [orderItems, setOrderItems] = useState([])
    const [showVendorDropdown, setShowVendorDropdown] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false);
    const [productos, setProductos] = useState([])

    useEffect(() => {
        getAllProducts()
          .then(response => {
            setProductos(response.data);
            console.log(response.data)
          })
          .catch(error => {
            console.error('Error al obtener productos:', error);
          });
    },[])

    // Modificamos el filtrado para que solo actúe si hay texto
    const searchResults = useMemo(() => {
    if (searchTerm.trim() === "") return [];
    return productos.filter(
        (product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    }, [searchTerm]);

    const handleSelectProduct = (product) => {
        addToOrder(product);
        setSearchTerm(""); // Limpiamos la búsqueda tras elegir
        setShowDropdown(false); // Cerramos el menú
    };


    // Calculate total
    const total = useMemo(() => {
        return orderItems.reduce((sum, item) => sum + item.price * item.cantidad, 0)
    }, [orderItems])

    // Add product to order
    const addToOrder = (product) => {
        setOrderItems((prev) => {
        const existing = prev.find((item) => item.productId === product.id)
        if (existing) {
            return prev.map((item) =>
            item.productId === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
            )
        }
        return [...prev, { productId: product.id, name: product.nombre, price: product.precio_venta, cantidad: 1 }]
        })
    }

    // Update quantity
    const updateQuantity = (productId, delta) => {
        // 1. Buscamos los datos necesarios fuera del setter
        const itemEnOrden = orderItems.find(item => item.productId === productId);
        const productData = productos.find(p => p.id === productId);
    
        if (!itemEnOrden || !productData) return;
    
        const newQuantity = itemEnOrden.cantidad + delta;
    
        if (delta > 0 && newQuantity > productData.cantidad) {
            toast.error(`Stock insuficiente para ${itemEnOrden.name}`, {
                description: `Solo quedan ${productData.cantidad} unidades disponibles.`,
                duration: 3000,
            });
            return;
        }
        setOrderItems((prev) => {
            return prev
                .map((item) => {
                    if (item.productId === productId) {
                        if (newQuantity <= 0) return null;
                        return { ...item, cantidad: newQuantity };
                    }
                    return item;
                })
                .filter(Boolean);
        });
    };

    // Remove item from order
    const removeFromOrder = (productId) => {
        setOrderItems((prev) => prev.filter((item) => item.productId !== productId))
    }

    // Finalize purchase
    const finalizePurchase = async () => {
        const payload = {
            vendedor: 1, // El ID del vendedor actual
            precio_total: total,
            productos: orderItems.map(item => ({
                producto: item.productId,
                cantidad: item.cantidad,
                precio_unitario: item.price
            }))
        };
    
        try {
            await postVenta(payload);
            setProductos(prevProductos => {
                return prevProductos.map(prod => {
                    const itemVendido = orderItems.find(item => item.productId === prod.id);
                    if (itemVendido) {
                        return { ...prod, cantidad: prod.cantidad - itemVendido.cantidad };
                    }
                    return prod;
                });
            });
            toast.success('Venta realizada exitosamente', {
                description: `Se ha vendido un total de $${total}.`,
                duration: 3000,
            });
            setOrderItems([]);
        } catch (error) {
            alert("Error: " + (error.response?.data?.error || error.message));
        }
    };


    return (
        <div className="min-h-screen mb-8 bg-gray-50">
            <main className="p-4 lg:p-6">
                <div className="flex flex-col gap-6 items-center w-full max-w-4xl mx-auto">
                {/* Left Column - Products */}
                <div className="w-full">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos por nombre..."
                        value={searchTerm}
                        onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    />
                    {showDropdown && searchTerm.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            searchResults.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => handleSelectProduct(product)}
                                className="w-full flex items-center justify-between p-4 hover:bg-blue-50 border-b border-gray-50 last:border-none transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#1c2d47] rounded flex items-center justify-center">
                                    <Package className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900 group-hover:text-black">{product.nombre}</p>
                                    <p className="text-xs text-gray-500">{product.ubicacion} • Cantidad: {product.cantidad}</p>
                                </div>
                                </div>
                                <div className="flex items-center gap-4">
                                <span className="font-bold text-green-700">${product.precio_venta}</span>
                                <Plus className="w-5 h-5 text-green-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                            No se encontraron productos con "{searchTerm}"
                            </div>
                        )}
                        </div>
                    )}
                    </div>
                </div>

                {/* Right Column - Order Sidebar */}
                <div className="w-full">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-6">
                    {/* Vendor Selector */}
                    <div className="p-4 border-b border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vendedor</label>
                        <div className="relative">
                        <button
                            onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                            className="w-full flex items-center gap-3 p-3 py-1 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos"
                            alt="Carlos"
                            className="w-10 h-10 rounded-full bg-gray-200"
                            />
                            <span className="font-medium text-[#111827]">carlos</span>
                        </button>

                        {/* {showVendorDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            {vendorsData.map((vendor) => (
                                <button
                                key={vendor.id}
                                onClick={() => {
                                    setSelectedVendor(vendor)
                                    setShowVendorDropdown(false)
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                >
                                <img
                                    src={vendor.avatar}
                                    alt={vendor.name}
                                    className="w-8 h-8 rounded-full bg-gray-200"
                                />
                                <span className="font-medium text-[#111827]">{vendor.name}</span>
                                </button>
                            ))}
                            </div>
                        )} */}
                        </div>
                    </div>

                    {/* Order Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#111827]">Orden Actual</h2>
                        <span className="text-sm text-gray-500">
                            {orderItems.length} {orderItems.length === 1 ? "producto" : "productos"}
                        </span>
                        </div>
                    </div>

                    {/* Order Items List */}
                    <div className="max-h-80 overflow-y-auto">
                        {orderItems.length === 0 ? (
                        <div className="p-8 text-center">
                            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">La orden está vacía</p>
                            <p className="text-sm text-gray-400 mt-1">Agrega productos para comenzar</p>
                        </div>
                        ) : (
                        <div className="divide-y divide-gray-100">
                            {orderItems.map((item) => (
                            <div key={item.productId} className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                <p className="font-medium text-[#111827] flex-1 pr-2">{item.name}</p>
                                <button
                                    onClick={() => removeFromOrder(item.productId)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                </div>
                                <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                    onClick={() => updateQuantity(item.productId, -1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                    <Minus className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <span className="w-8 text-center font-medium text-[#111827]">{item.cantidad}</span>
                                    <button
                                    onClick={() => updateQuantity(item.productId, 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                    <Plus className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">${item.price} c/u</p>
                                    <p className="font-semibold text-[#111827]">
                                    ${(item.price * item.cantidad)}
                                    </p>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <span className="text-lg font-semibold text-[#111827]">Total</span>
                        <span className="text-2xl font-bold text-green-600">${(total).toFixed(2)}</span>
                        </div>

                        <button
                        onClick={finalizePurchase}
                        disabled={orderItems.length === 0}
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-[#1c2d47] hover:bg-[#373a3f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-xl transition-colors text-[18px]"
                        >
                        <CheckCircle className="w-5 h-5" />
                        Finalizar Compra
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </main>
        </div>
    )
}
