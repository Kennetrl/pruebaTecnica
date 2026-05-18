import { useState } from "react";
import { crearTarjeta } from "../api/tarjetas";

function FormNuevaTarjeta({ onSuccess, onClose }) {
    const [form, setForm] = useState({
        titular: "",
        numeroTarjeta: "",
        limiteCredito: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await crearTarjeta({
                ...form,
                limiteCredito: parseFloat(form.limiteCredito)
            });
            onSuccess();
            onClose();
        } catch (error) {
            alert("Error al crear la tarjeta");
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Titular</label>
                <input
                    className="form-input"
                    name="titular"
                    value={form.titular}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Número de tarjeta</label>
                <input
                    className="form-input"
                    name="numeroTarjeta"
                    value={form.numeroTarjeta}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Límite de crédito</label>
                <input
                    className="form-input"
                    type="number"
                    name="limiteCredito"
                    value={form.limiteCredito}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-actions">
                <button className="btn btn-secondary" type="button" onClick={onClose}>
                    Cancelar
                </button>
                <button className="btn btn-primary" type="submit">
                    Guardar
                </button>
            </div>
        </form>
    );
}

export default FormNuevaTarjeta;