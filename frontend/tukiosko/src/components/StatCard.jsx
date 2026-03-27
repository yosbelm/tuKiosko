export default function StatCard({ 
    title, value, icon, iconBg, trendText, 
    trendValue, cantidad
  }) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 min-w-40">
        <div className="flex items-center gap-4">
          {/* Icono con fondo de color */}
          <div className={`${iconBg} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
          
          {/* Título y valor */}
          <div className="text-right flex-1">
            <h3 className="text-gray-400 text-xs font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{cantidad}</p>
          </div>
        </div>
        
        {/* Línea divisoria */}
        <div className="border-t border-gray-100 mt-4">
          <p className="text-sm">
            {trendValue && (
              <span className="text-green-500 font-semibold">{trendValue}</span>
            )}
            <span className="text-gray-400">
                {value !== "Vendedores de este kiosko" ? `Total Vendido: ${value}` : `Vendedores en este kiosko`}
            </span>
          </p>
        </div>
      </div>
    )
  }
  