import { DollarSign } from "lucide-react";
import {Link} from 'react-router-dom'


export default function VentasRow({ ventaId, name, precio, cantidad, seed, date }) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 lg:px-6">
            <Link to={`/ventas/${ventaId}/`}>
                <div className="flex items-center gap-3 text-nowrap">
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed === 'female' ? 'Aneka' : 'Jack'}`} 
                        alt={name} 
                        className="w-10 h-10 rounded-full bg-gray-100"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                        <p className="text-xs text-gray-500">Ticket: {ventaId}</p>
                    </div>
                </div>
            </Link>
            </td>
            {/* <td className="hidden md:table-cell px-4 py-3 lg:px-6">
                <span className="text-sm text-gray-600">{cantidad} items</span>
            </td> */}
            <td className="px-4 py-3 lg:px-6 text-center">
                <span className="text-nowrap inline-flex items-center gap-1 px-2.5 py-1 font-bold bg-green-100 text-green-600 text-sm rounded-full">
                    <DollarSign className="w-3.5 h-3.5" />
                    {precio}
                </span>
            </td>
            <td className="px-4 py-3 lg:px-6 text-center text-nowrap">
                <span className="text-[14px] text-gray-500">{date}</span>
            </td>
        </tr>
    );
}