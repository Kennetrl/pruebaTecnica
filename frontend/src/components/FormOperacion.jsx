import { useState } from "react";
import { registrarConsumo, registrarPago } from "../api/tarjetas";

function FormOperacion({ tarjeta, onSuccess, onClose }) {
    const [tipo, setTipo] = useState("CONSUMO");
    const [monto, setMonto] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const montoNum = parseFloat(monto);
            if (tipo === "CONSUMO") {
                await registrarConsumo(tarjeta.id, montoNum);
            } else {
                await registrarPago(tarjeta.id, montoNum);
            }
            onSuccess();
            onClose();
        } catch (error) {
            alert("Error al registrar la operación");
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-info">
                <p><span>Tarjeta:</span> {tarjeta.numeroTarjeta}</p>
                <p><span>Saldo disponible:</span> ${tarjeta.saldoDisponible}</p>
            </div>
            <div className="form-group">
                <label>Tipo de operación</label>
                <select
                    className="form-input"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="CONSUMO">Consumo</option>
                    <option value="PAGO">Pago</option>
                </select>
            </div>
            <div className="form-group">
                <label>Monto</label>
                <input
                    className="form-input"
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    required
                />
            </div>
            <div className="form-actions">
                <button className="btn btn-secondary" type="button" onClick={onClose}>
                    Cancelar
                </button>
                <button className="btn btn-primary" type="submit">
                    Confirmar
                </button>
            </div>
        </form>
    );
}

export default FormOperacion;