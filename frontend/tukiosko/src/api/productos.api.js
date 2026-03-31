import axios from 'axios';

const apiUrl = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

axios.defaults.withCredentials = true;

apiUrl.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await apiUrl.post('/token/refresh/');
                return apiUrl(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


// GET
export const getAllProducts = () => {
    return apiUrl.get(`/productos/`);
};

export const getTodosProductos = () => {
    return apiUrl.get(`/todos-productos/`);
};

export const getAllVentas = () => {
    return apiUrl.get(`/datos-ventas/`);
};

export const getDetallesVenta = (id) => {
    return apiUrl.get(`/detalles-venta/${id}/`);
};

export const getAllVendedores = () => {
    return apiUrl.get(`/vendedores/`);
}

export const getAllAreas = () => {
    return apiUrl.get(`/areas/`);
}

export const getProducto = (id) => {
    return apiUrl.get(`/producto-detalles/${id}/`);
}

// POST
export const postNuevaArea = (data) => {
    return apiUrl.post(`/areas/`, data);
};

export const postNuevoProducto = (data) => {
    return apiUrl.post(`/productos/`, data);
};

export const postNuevoVendedor = (data) => {
    return apiUrl.post(`/vendedores/`, data);
};

export const postVenta = (data) => {
    return apiUrl.post(`/ventas/finalizar_venta/`, data);
};


// PATCH
export const patchProducto = (id, data) => {
    return apiUrl.patch(`/todos-productos/${id}/`, data)
}

// DELETE
export const deleteProducto = (id) => {
    return apiUrl.delete(`/eliminar-producto/${id}/`)
}



// Authentication
export const registrarUsuario = (data) => {
    return apiUrl.post(`/register/`, data)
}


export const iniciarSesion = async (data) => {
    return await apiUrl.post(`/token/`, data);
}


export const cerrarSesion = () => {
    return apiUrl.post(`/logout/`)
}


export const estaAutenticado = async () => {
    return await apiUrl.get(`/authenticated/`);
};


export const refreshToken = async () => {
    try {
        const response = await apiUrl.post(`/token/refresh/`);
        return response.data.refreshed; 
    } catch (error) {
        return false;
    }
}


export const call_refresh = async(error, originalRequestFunc) => {
    if (error.response && error.response.status == 401){
        const tokenRefreshed =  await refreshToken();
        if (tokenRefreshed){
            return await originalRequestFunc();
        }
    }
    throw error
}