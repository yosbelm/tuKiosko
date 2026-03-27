import { ChartLine, BoxIcon, LocationEditIcon, PackageOpen, User2, Settings2, PackagePlus, MapPinPlus, UserRoundPlus } from "lucide-react"
import SectionTitle from './SectionTitle'
import SidebarLink from './SidebarLink';



export default function Sidebar({ isOpen, toggle }){
    const toggleSidebar = () => {
        setIsSidebarOpen(!isOpen);
      };
    return(
        <>
        {/* Sidebar Overlay (Mobile) */}
        {isOpen && (
            <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
            ></div>
        )}
        {isOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={toggle}></div>
        )}

        <aside className={`fixed left-0 mx-1 pr-2 my-2 rounded-2xl bottom-0 top-0 w-64 bg-[#1c2d47] text-white z-50 overflow-y-auto transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00ead0] rounded-full flex items-center justify-center">
                {/* <i className="fas fa-chart-line text-[#1c2d47] text-sm"></i> */}
                <ChartLine className="w-4 h-4 text-[#1c2d47] text-sm"/>
                </div>
                <span className="font-semibold text-lg">tuKiosko</span>
            </div>
            <button onClick={toggleSidebar} className="text-white/70 hover:text-white">
                <i className="fas fa-times"></i>
                {/* <Timer className="w-4 h-4"/> */}
            </button>
            </div>

            {/* Navigation */}
            <nav className="py-1 text-sm">
            <SectionTitle title="Navegacion" />
            <SidebarLink direccion={"/"} icon={<Settings2 className="w-4 h-4" />} label="Panel" active />

            <SectionTitle title="Administrar" />
            <SidebarLink direccion="/agregar-producto" icon={<PackagePlus className="w-4 h-4" />} label="Agregar Productos" hasArrow />
            <SidebarLink direccion="/agregar-area" icon={<MapPinPlus className="w-4 h-4" />} label="Agregar Area" hasArrow />
            <SidebarLink direccion="/agregar-vendedor" icon={<UserRoundPlus className="w-4 h-4" />} label="Agregar Vendedor" hasArrow />

            {/* <SidebarLink icon="fa-power-off" label="Disabled menu" disabled /> */}
            </nav>
        </aside>
        </>
    )
}