import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Importar useParams y useNavigate para obtener el ID del auto y navegar
import "./ViewCar.css";
import { ToastContainer, toast } from "react-toastify";

const API_AUTOS = "http://localhost:8080/admin/clientes/"; // Reemplazar con la URL de tu API

function DetallesAuto() {
  const [auto, setAuto] = useState({}); // Estado para almacenar los detalles del auto
  const [autoEditado, setAutoEditado] = useState({}); // Estado para almacenar los cambios realizados
  const { idAuto } = useParams(); // Obtener el ID del auto de los parámetros de la URL
  const [loadingE, setLoadingE] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_AUTOS}${idAuto}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "token_ymcars_2024",
      },
    })
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setAuto(datos);
        setAutoEditado(datos); // Inicializar el estado editado con los datos originales
        setLoading(false);
      });
  }, [idAuto]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAutoEditado({ ...autoEditado, [name]: value }); // Actualizar el estado editado con el nuevo valor
  };

  const handleInputChangeEstadoNuevo = (event) => {
    const { value } = event.target;
    setAutoEditado({ ...autoEditado, nuevoEstado: value }); // Actualizar el estado editado con el nuevo valor
  };

  const agregarNuevoEstado = async () => {
    setLoadingE(true);
    if (!autoEditado.nuevoEstado) {
      alert("Ingrese un estado válido.");
      return;
    }

    const nuevoEstado = {
      fecha: new Date().toISOString().slice(0, 10),
      estado: autoEditado.nuevoEstado,
    };

    // Implementar la lógica para agregar un nuevo estado al auto
    const res = await fetch(`${API_AUTOS}agregar/${idAuto}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token_ymcars_2024",
      },

      body: JSON.stringify(nuevoEstado),
    });
    res.ok
      ? toast.success("Auto actualizado correctamente.", {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          draggable: true,
        })
      : alert("Error al actualizar el estado.");
    auto.historialEstados.push(nuevoEstado);
    setAutoEditado({ ...autoEditado, nuevoEstado: "" });
    setAuto({ ...auto, historialEstados: auto.historialEstados });
    setLoadingE(false);
  };

  const handleConfirmEdit = async () => {
    setLoading(true);
    await fetch(`${API_AUTOS}editar/${idAuto}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token_ymcars_2024",
      },
      body: JSON.stringify(autoEditado), // Enviar el estado editado al servidor
    })
      .then((respuesta) => respuesta.json())
      .then((datosActualizados) => {
        toast.success("Auto actualizado correctamente.", {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          draggable: true,
        });
        setAuto(datosActualizados); // Actualizar el estado con los datos actualizados
        setAutoEditado(datosActualizados); // Restablecer el estado editado a los datos actualizados
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        alert("Error al actualizar el auto.");
      });
  };

  if (!auto) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="cont-detalles-auto">
      <div className="detalles-auto">
        <h2>
          Detalles del auto <span>{auto.patente}</span>
        </h2>
        <p>
          <b>Marca:</b>
          <input
            type="text"
            name="marca"
            value={autoEditado.marca}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <b>Modelo:</b>
          <input
            type="text"
            name="modelo"
            value={autoEditado.modelo}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <b>Aseguradora:</b>
          <input
            type="text"
            name="aseguradora"
            value={autoEditado.aseguradora}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <b>Nº Siniestro:</b>
          <input
            type="text"
            name="numeroSiniestro"
            value={autoEditado.numeroSiniestro}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <b>Código de Color:</b>
          <input
            type="text"
            name="codigoColor"
            value={autoEditado.codigoColor}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <b>Fecha de Ingreso:</b>
          <input
            type="date"
            name="fechaIngreso"
            value={autoEditado.fechaIngreso}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <b>Fecha de Egreso:</b>
          <input
            type="date"
            name="fechaEntrega"
            value={autoEditado.fechaEntrega}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <b>Estado Actual:</b>
          <input
            type="text"
            name="estadoActual"
            value={autoEditado.estadoActual}
            onChange={handleInputChange}
          />
        </p>
        <div className="acciones">
          <button className="btn-editar" onClick={handleConfirmEdit}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
            className="btn-volver"
            onClick={() => (window.location.href = "/admin/autos")}
          >
            Volver a la lista
          </button>
        </div>
      </div>
      <div class="cont-historial-estados">
        <h2>Historial de Estados</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {auto.historialEstados?.map((estado) => (
              <tr key={estado.fecha}>
                <td>{estado.fecha}</td>
                <td>{estado.estado}</td>
                <td>
                  {auto.estadoActual === estado.estado ? (
                    <span className="activo">Activo</span>
                  ) : (
                    <span className="inactivo">Inactivo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <b>Agregar Nuevo Estado del auto:</b>
        <input
          type="text"
          name="nuevoEstado"
          value={autoEditado.nuevoEstado}
          onChange={handleInputChangeEstadoNuevo}
        />
        <button
          className="btn-agregar-estado"
          onClick={() => agregarNuevoEstado()}
        >
          {loadingE ? "Agregando..." : "Agregar"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default DetallesAuto;
