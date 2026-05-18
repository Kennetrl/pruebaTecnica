import './index.css'
import { useEffect, useState } from "react";
import { listarTarjetas } from "./api/tarjetas";
import TarjetaCard from "./components/TarjetaCard";
import FormNuevaTarjeta from "./components/FormNuevaTarjeta";
import FormOperacion from "./components/FormOperacion";
import Modal from "./components/Modal";

function App() {
  const [tarjetas, setTarjetas] = useState([]);
  const [modalNueva, setModalNueva] = useState(false);
  const [modalOperacion, setModalOperacion] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);

  const cargarTarjetas = async () => {
    try {
      const data = await listarTarjetas();
      setTarjetas(data);
    } catch (error) {
      alert("Error al cargar las tarjetas");
    }
  };

  useEffect(() => {
    cargarTarjetas();
  }, []);

  const handleOperacion = (tarjeta) => {
    setTarjetaSeleccionada(tarjeta);
    setModalOperacion(true);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Gestión de Tarjetas de Crédito</h1>
        <button className="btn btn-primary" onClick={() => setModalNueva(true)}>
          + Nueva Tarjeta
        </button>
      </div>

      <div className="tarjetas-grid">
        {tarjetas.length === 0 ? (
          <p className="empty-msg">No hay tarjetas registradas</p>
        ) : (
          tarjetas.map((tarjeta) => (
            <TarjetaCard
              key={tarjeta.id}
              tarjeta={tarjeta}
              onActualizar={cargarTarjetas}
              onOperacion={handleOperacion}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={modalNueva}
        onClose={() => setModalNueva(false)}
        titulo="Nueva Tarjeta"
      >
        <FormNuevaTarjeta
          onSuccess={cargarTarjetas}
          onClose={() => setModalNueva(false)}
        />
      </Modal>

      <Modal
        isOpen={modalOperacion}
        onClose={() => setModalOperacion(false)}
        titulo="Registrar Operación"
      >
        {tarjetaSeleccionada && (
          <FormOperacion
            tarjeta={tarjetaSeleccionada}
            onSuccess={cargarTarjetas}
            onClose={() => setModalOperacion(false)}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;