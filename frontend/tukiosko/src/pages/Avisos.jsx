import { AlertTriangle, Calendar1, Camera, FileWarning, LucideMailWarning, Megaphone, SendHorizonalIcon, Signal } from "lucide-react";


export default function Avisos(){
    const avatars = [
        { id: 1, src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella', alt: 'Persona 1' },
        { id: 2, src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', alt: 'Persona 2' },
        { id: 3, src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', alt: 'Persona 3' },
      ];

    return(
        <div className="p-4 lg:p-6 lg:pt-2">
            <div className="flex justify-center px-6">
                <section className="flex justify-center flex-col gap-3">
                    <div className="lg:w-115 md:w-88 sm:w-80 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center px-6 py-3 border-b border-gray-200 gap-2">
                            <div className="flex items-center justify-center rounded-full bg-gray-300 border border-gray-200 w-7 h-7">
                                <Megaphone className="w-4 h-4 font-bold text-[#1c2d47]" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Título del Aviso</h2>
                        </div>
                        <div className="px-6 lg:px-12 py-2 pb-6">
                            <div className="pb-3">
                                <label className="text-sm font-medium text-gray-700">Tipo de aviso</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                                    <AlertTriangle className="w-4 h-4" />
                                    </span>
                                    <select 
                                        name="zona" 
                                        className="w-full pl-12 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">Prioridad Baja</option>
                                        <option value="masculino">Prioridad Media</option>
                                        <option value="femenino">Prioridad Alta</option>\
                                    </select>
                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="pt-0">
                                <label className="text-sm font-medium text-gray-700">Descripción</label>
                                <div className="relative mr-0 pt-0">
                                    {/* <AlertOctagonIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                                    <textarea
                                        type="text"
                                        placeholder="Escribe el nombre..."
                                        className="w-full pl-4 pr-14 py-2 bg-white border rounded-xl border-gray-300 text-gray-900 
                                        focus:outline-none focus:ring-1  focus:ring-[#1c2d47]/0 focus:border-[#1c2d47] transition-all"
                                    />
                                    <button className="absolute right-1/20 top-3/5 -translate-y-1/2 p-1.5 bg-[#1c2d47] text-white rounded-full hover:bg-[#2a3e5d] transition-colors shadow-md">
                                        <SendHorizonalIcon className=" w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-115 md:w-88 sm:w-80 bg-white rounded-xl border border-gray-200 shadow-sm ">
                        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 gap-2">
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center justify-center rounded-full bg-red-100 border border-gray-200 w-7 h-7">
                                    <h1 className="text-red-600 font-bold">!!!</h1>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Prioridad Alta</h2>
                            </div>
                            <div className="flex justify-center items-center gap-1 text-[12px] text-gray-500">
                                <Calendar1 className="w-3 h-3" />
                                4 abril
                            </div>
                        </div>
                        <div className="text-sm px-6 py-2">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti ipsa, eveniet dolorem minus quas laudantium quae quasi quo ea odit quam exercitationem laboriosam ducimus. Harum accusamus dignissimos explicabo quidem laborum!
                        </div>
                        <div className="flex justify-between px-6 py-3">
                            <div className="flex justify-center items-center gap-2">
                                <p className="text-center text-gray-500">Administrador</p>
                            </div>
                            <div className="">
                            <div className="flex -space-x-3"> {/* Aumenté un poco el solapamiento de -space-x-2 a -3 */}
                                {avatars.map((avatar) => (
                                    <div
                                        key={avatar.id}
                                        className="inline-block h-8 w-8 rounded-full ring-1 ring-white shadow-sm overflow-hidden"
                                        >
                                        <img
                                            className="h-full w-full object-cover bg-gray-200 aspect-square"
                                            src={avatar.src}
                                            alt={avatar.alt}
                                        />
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}