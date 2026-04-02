import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const PublicRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="p-4 lg:p-6 lg:pt-2 min-h-screen pb-18 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1c2d47]"></div>
            </div>
        );
    }

    // Si ya está autenticado, redirigir según el rol
    if (isAuthenticated) {
        return user?.rol === 'administrador' 
            ? <Navigate to="/panel" replace /> 
            : <Navigate to="/historial" replace />;
    }

    // Si no está autenticado, mostrar la página de login/registro
    return children;
};

export default PublicRoute;