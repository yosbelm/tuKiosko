import axios from 'axios';

const apiUrl = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/"
});

// GET
export const getAllProducts = () => {
    return apiUrl.get(`/productos/`);
};

export const getAllVentas = () => {
    return apiUrl.get(`/datos-ventas/`);
};

export const getAllVendedores = () => {
    return apiUrl.get(`/vendedores/`);
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

