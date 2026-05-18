import axios from "axios";

const BASE_URL = "http://localhost:8080/api/tarjetas";

export const listarTarjetas = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

export const crearTarjeta = async (tarjeta) => {
    const response = await axios.post(BASE_URL, tarjeta);
    return response.data;
};

export const bloquearTarjeta = async (id) => {
    const response = await axios.patch(`${BASE_URL}/${id}/bloquear`);
    return response.data;
};

export const registrarConsumo = async (id, monto) => {
    const response = await axios.post(`${BASE_URL}/${id}/consumo`, { monto });
    return response.data;
};

export const registrarPago = async (id, monto) => {
    const response = await axios.post(`${BASE_URL}/${id}/pago`, { monto });
    return response.data;
};