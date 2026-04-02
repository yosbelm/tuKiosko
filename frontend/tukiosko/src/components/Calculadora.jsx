import { useState } from "react"
import { X, Calculator, RotateCcw } from "lucide-react"
import { toast } from "sonner"

const DENOMINACIONES = [1000, 500, 200, 100, 50, 20, 10, 5]

export default function Calculadora({ total, onClose }) {
    const [cantidades, setCantidades] = useState({5: 0, 10: 0, 20: 0, 50: 0, 100: 0, 200: 0, 500: 0, 1000: 0})

    const montoRecibido = Object.entries(cantidades).reduce(
        (acc, [denominacion, cantidad]) => acc + Number(denominacion) * cantidad,
        0
    )

    const vuelto = montoRecibido - total

    const handleIncrement = (denominacion) => {
        setCantidades((prev) => ({
        ...prev,
        [denominacion]: prev[denominacion] + 1,
        }))
    }

    const handleInputChange = (denominacion, value) => {
        const cantidad = Math.max(0, parseInt(value) || 0)
        setCantidades((prev) => ({
        ...prev,
        [denominacion]: cantidad,
        }))
    }

    const handleReset = () => {
        setCantidades({5: 0, 10: 0, 20: 0, 50: 0, 100: 0, 200: 0, 500: 0, 1000: 0,})
    }

    const handleConfirmar = () => {
        if (montoRecibido < total) {
        toast.error("Monto insuficiente", {
            description: `Faltan $${(total - montoRecibido)} para completar el pago.`,
        })
        return
        }
        toast.success("Cálculo completado", {
        description: `Vuelto: $${vuelto}`,
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-lg transition-colors"
                >
                    <div className="flex justify-center w-5 h-5 items-center rounded-full bg-[#1c2d47]/50 text-gray-100 hover:bg-[#1c2d47]/90">
                        <X className="w-4 h-4 font-extrabold" />
                    </div>
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
                {/* <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1c2d47]">
                    <Calculator className="w-4 h-4 text-white" />
                </div> */}
                <h3 className="text-lg font-semibold text-gray-900">Calculadora de Vuelto</h3>
                {/* <h2 className="text-base font-semibold text-gray-900">Calculadora de Vuelto</h2> */}
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                {/* Denominaciones Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {DENOMINACIONES.map((denominacion) => (
                    <div
                        key={denominacion}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2"
                    >
                        <button
                        onClick={() => handleIncrement(denominacion)}
                        className="flex-1 bg-[#1c2d47] hover:bg-[#2a3d5a] active:bg-[#373a3f] text-white rounded-lg py-2 px-3 font-semibold text-sm transition-colors"
                        >
                        ${denominacion}
                        </button>
                        <input
                        type="number"
                        min="0"
                        value={cantidades[denominacion] || ""}
                        onChange={(e) => handleInputChange(denominacion, e.target.value)}
                        placeholder="0"
                        className="w-14 h-9 text-center text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c2d47] focus:border-transparent"
                        />
                    </div>
                    ))}
                </div>

                {/* Resultados */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total a Pagar:</span>
                    <span className="text-base font-semibold text-gray-900">${total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monto Recibido:</span>
                    <span className="text-base font-semibold text-gray-900">${montoRecibido}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Vuelto:</span>
                    <span
                        className={`text-lg font-bold ${
                        vuelto >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {vuelto < 0 && "-"}${Math.abs(vuelto)}
                        {vuelto > 0 && <span className="text-xs ml-1 font-normal">(sobra)</span>}
                        {vuelto < 0 && <span className="text-xs ml-1 font-normal">(falta)</span>}
                    </span>
                    </div>
                </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reiniciar
                </button>
                <div className="flex items-center gap-2">
                    <button
                    onClick={onClose}
                    className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleConfirmar}
                    className="px-4 py-2 bg-[#1c2d47] hover:bg-[#2a3d5a] text-white rounded-lg transition-colors text-sm font-medium"
                    >
                    Confirmar
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}
