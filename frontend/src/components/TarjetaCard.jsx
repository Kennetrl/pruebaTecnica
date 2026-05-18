import { bloquearTarjeta } from "../api/tarjetas";

function TarjetaCard({ tarjeta, onActualizar, onOperacion }) {
    const handleBloquear = async () => {
        if (!window.confirm("¿Estás seguro de bloquear esta tarjeta?")) return;
        try {
            await bloquearTarjeta(tarjeta.id);
            onActualizar();
        } catch (error) {
            alert("Error al bloquear la tarjeta");
        }
    };

    return (
        <div className={`tarjeta-card ${tarjeta.estado === "BLOQUEADA" ? "bloqueada" : ""}`}>
            <div className="tarjeta-header">
                <h3>{tarjeta.titular}</h3>
                <span className={`badge ${tarjeta.estado === "ACTIVA" ? "badge-activa" : "badge-bloqueada"}`}>
                    {tarjeta.estado}
                </span>
            </div>
            <div className="tarjeta-body">
                <p><span>Número:</span> {tarjeta.numeroTarjeta}</p>
                <p><span>Límite:</span> ${tarjeta.limiteCredito}</p>
                <p><span>Saldo disponible:</span> ${tarjeta.saldoDisponible}</p>
            </div>
            {tarjeta.estado === "ACTIVA" && (
                <div className="tarjeta-actions">
                    <button className="btn btn-danger" onClick={handleBloquear}>
                        Bloquear
                    </button>
                    <button className="btn btn-secondary" onClick={() => onOperacion(tarjeta)}>
                        Consumo / Pago
                    </button>
                </div>
            )}
        </div>
    );
}

export default TarjetaCard;