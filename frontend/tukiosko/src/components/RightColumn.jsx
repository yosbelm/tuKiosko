import fechaFinal from '../../utils/Date'

export default function RightColumn({ precio, cantidad, producto, creado }){
    return(
        // Cambiamos overflow-hidden por overflow-x-auto
        <div className="bg-white rounded-lg shadow-sm p-0 overflow-x-auto scrollbar-hide">
            {/* Agregamos min-w-max para forzar a los elementos a mantener su tamaño y disparar el scroll */}
            <table className="w-full min-w-max">
                <tbody>
                    <tr className="hover:bg-gray-50 transition-colors flex justify-between">
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 uppercase rounded-full bg-gray-100 flex justify-center items-center shrink-0">
                                    {producto[0]}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700 whitespace-nowrap">{producto}</p>
                                    <p className="text-xs font-bold text-green-500">${precio}</p>                                        
                                </div>
                            </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap flex items-center">
                            <div className="flex items-center gap-2">
                                {/* <span className="w-2 h-2 rounded-full bg-green-400"></span> */}
                                <span className="px-2 py-1 bg-[#1c2d47]/80 text-white text-xs font-bold rounded-full">
                                    {cantidad}
                                </span>
                                {/* <span className="text-gray-500 text-sm">{fechaFinal(creado)}</span> */}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}