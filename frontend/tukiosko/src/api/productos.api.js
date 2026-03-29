import axios from 'axios';

const apiUrl = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/"
});

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

