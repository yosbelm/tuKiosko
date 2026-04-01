import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import React from "react";

const PrivateRoute = ({ children, rolPermitido }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="p-4 lg:p-6 lg:pt-2 min-h-screen pb-18 flex items-center justify-center">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1c2d47]"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={"/"} replace />;
    }

    if (rolPermitido && user?.rol !== rolPermitido) {
        console.log(`desde private route ${user.rol}`)
        return user?.rol === 'administrador' 
            ? <Navigate to={"/panel"} replace />
            : <Navigate to={"/historial"} replace />;
    }

    return children;
};

export default PrivateRoute;