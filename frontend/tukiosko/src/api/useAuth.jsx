import { createContext, useContext, useState, useEffect } from "react";
import { estaAutenticado } from './productos.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Guardar info del usuario (rol, username)
    const [loading, setLoading] = useState(true);

    const checkStatus = async () => {
        try {
            const response = await estaAutenticado();
            // response.data contiene {"autenticado": true, "rol": "..."}
            setIsAuthenticated(response.data.autenticado);
            setUser(response.data);
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        checkStatus();
    }, []);

    if (loading) {
        return (
            <div className="p-4 lg:p-6 lg:pt-2 min-h-screen pb-18 flex items-center justify-center">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1c2d47]"></div>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, checkStatus, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);