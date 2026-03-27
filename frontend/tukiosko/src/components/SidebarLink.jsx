import { Link, useOutletContext } from 'react-router-dom';

export default function SidebarLink ({ icon, label, active, hasArrow, disabled, direccion }) {
    return (
        <Link 
          to={direccion} 
          className={`flex items-center justify-between px-6 py-3 transition-colors ${
            active ? 'border-l-4 border-[#00ead0] bg-white/10 text-white' : 
            disabled ? 'text-white/30 cursor-not-allowed' : 'text-white/70 hover:bg-[#263d5a] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            {icon} 
            <span>{label}</span>
          </div>
          {hasArrow && <i className="fas fa-chevron-right text-xs"></i>}
        </Link>
    )
};