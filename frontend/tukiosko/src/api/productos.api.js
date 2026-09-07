import axios from 'axios';

const apiUrl = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
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
    return apiUrl.get(`/productos/get_productos/`);
};

export const getTodosProductos = () => {
    return apiUrl.get(`/todos-productos/obtener_productos/`);
};

export const getAllVentas = () => {
    return apiUrl.get(`/datos-ventas/`);
};

export const getAllAdminVentas = () => {
    return apiUrl.get(`/datos-all-ventas/`);
};

export const getDetallesVenta = (id) => {
    return apiUrl.get(`/detalles-venta/${id}/`);
};

export const getAllVendedores = () => {
    return apiUrl.get(`/vendedores/get_vendedor/`);
}

export const getAllAreas = () => {
    return apiUrl.get(`/areas/obtener_area/`);
}

export const getAllCategorias = () => {
    return apiUrl.get(`/categorias/obtener_categoria/`);
}

export const getProducto = (id) => {
    return apiUrl.get(`/producto-detalles/${id}/`);
}

export const getUsuario = () => {
    return apiUrl.get(`/usuarios/get_usuario/`);
}

export const getAvisos = () => {
    return apiUrl.get(`/avisos/get_avisos/`);
}

export const getAvisosVendedor = () => {
    return apiUrl.get(`/avisos/get_avisos_no_leidos_vendedor/`);
}

// POST
export const postNuevaArea = (data) => {
    return apiUrl.post(`/areas/subir_area/`, data);
};

export const postNuevaCategoria = (data) => {
    return apiUrl.post(`/categorias/subir_categoria/`, data);
};

export const postNuevoProducto = (data) => {
    return apiUrl.post(`/productos/subir_producto/`, data);
};


export const postNuevaCantidad = (id, data) => {
    return apiUrl.patch(`/productos/${id}/actualizar_cantidad_producto/`, data);
};

// export const postNuevoVendedor = (data) => {
//     return apiUrl.post(`/vendedores/`, data);
// };

export const postVenta = (data) => {
    return apiUrl.post(`/ventas/finalizar_venta/`, data);
};

export const postNuevoAviso = (data) => {
    return apiUrl.post(`/avisos/publicar_aviso/`, data);
};


// PATCH
export const patchProducto = (id, data) => {
    return apiUrl.patch(`/todos-productos/${id}/editar_producto/`, data)
}

export const patchAlmacenamiento = (id, data) => {
    return apiUrl.patch(`/todos-productos/${id}/editar_producto/`, data)
}

export const patchAreaPorDefecto = (id) => {
    return apiUrl.patch(`/areas/${id}/definir_area_principal/`)
}

export const patchAvisoLeido = (id) => {
    return apiUrl.patch(`/avisos/${id}/marcar_leido/`)
}

export const patchTodosAvisoLeido = () => {
    return apiUrl.patch(`/avisos/marcar_todos_leido/`)
}

// DELETE
export const deleteProducto = (id) => {
    return apiUrl.delete(`/eliminar-producto/${id}/`)
}

export const deleteAviso = (id) => {
    return apiUrl.delete(`/avisos/${id}/delete_aviso/`)
}



// Authentication
export const registrarUsuario = (data, referido) => {
    const url = referido 
        ? `/register/?referido=${referido}` 
        : `/register/`;
    return apiUrl.post(url, data)
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