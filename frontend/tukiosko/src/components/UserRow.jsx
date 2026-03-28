

export default function UserRow ({ name, precio, seed, date, status }){
    return (
        <tr className="flex justify-between gap-3 hover:bg-gray-50 transition-colors">
            <td className="py-4 px-6 whitespace-nowrap">
                <div className="flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed === 'femenino' ? 'Isabella' : 'Carlos'}`} alt={name} className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="">
                    <p className="font-medium text-gray-700">{name}</p>
                    <p className="text-xs text-gray-400">{date}</p>                        
                </div>
                </div>
            </td>
            <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-[#ff5252]'}`}></span>
                <span className="font-semibold text-green-500">${precio}</span>
                </div>
            </td>
            {/* <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                <button className="px-4 py-1.5 bg-[#9182f2] text-white text-xs font-medium rounded-full hover:opacity-90">Reject</button>
                <button className="px-4 py-1.5 bg-[#1de9b6] text-white text-xs font-medium rounded-full hover:opacity-90">Approve</button>
                </div>
            </td> */}
        </tr>
    )
};