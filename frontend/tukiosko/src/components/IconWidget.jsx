export default function IconWidget({ icon, color, iconColor, value, label }){
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
            <i className={`fas ${icon} ${iconColor} text-xl`}></i>
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-700">{value}</p>
            <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
        </div>
        </div>
    )
};