import React, { useState, useEffect } from "react";
import "./AdminCars.css";
import { Dropdown, DropdownMenu } from "semantic-ui-react";
import CrearAuto from "./CrearAuto.js";

const API_AUTOS = "http://localhost:8080/admin/clientes"; // Reemplazar con la URL de tu API

function AdminCars() {
  const [autos, setAutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [mostrarDetalles, setMostrarDetalles] = useState({});
  const [loading, setLoading] = useState(true);
  const [modoCrear, setModoCrear] = useState(false);
  const [eliminado, setEliminado] = useState(false);

  useEffect(() => {
    console.log("Cargando autos...");
    setLoading(true);
    fetch(API_AUTOS, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "token_ymcars_2024",
      },
    })
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        datos = datos.filter((auto) => auto.eliminado === eliminado);
        setAutos(datos);
        setLoading(false);
      }); // Obtiene los primeros 50 autos
  }, [eliminado]);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const autosFiltrados = autos.filter((auto) => {
    const busqueda = filtro.toLowerCase();
    return (
      auto.patente.toLowerCase().includes(busqueda) ||
      auto.aseguradora.toLowerCase().includes(busqueda) ||
      auto.numeroSiniestro.toLowerCase().includes(busqueda)
    );
  });

  const handleVerDetalle = (idAuto) => {
    window.location.href = `/admin/autos/${idAuto}`; // Navega a la página de detalles del auto
  };

  const verFactura = (url) => {
    window.open(url, "_blank"); // Abre la factura en una nueva pestaña
  };

  const handleCerrarDetalles = (idAuto) => {
    setMostrarDetalles({ ...mostrarDetalles, [idAuto]: false }); // Cierra detalles del auto seleccionado
  };

  const handleVerEliminados = () => {
    setEliminado(!eliminado);
  };

  const handleCrear = () => {
    setModoCrear(!modoCrear);
  };

  const handleEliminarPermanentemente = (idAuto) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este auto permanentemente?"
    );
    if (confirmar) {
      fetch(`${API_AUTOS}/eliminar/${idAuto}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "token_ymcars_2024",
        },
      })
        .then((respuesta) => respuesta.json())
        .then(() => {
          setAutos(autos.filter((auto) => auto._id !== idAuto));
        });
    }
  };

  const handleEliminar = (idAuto, eliminar) => {
    // Implementar la lógica para eliminar un auto
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas ${
        eliminar ? "eliminar" : "restaurar"
      } este auto?`
    );
    if (confirmar) {
      fetch(`${API_AUTOS}/editar/${idAuto}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "token_ymcars_2024",
        },
        body: JSON.stringify({ eliminado: eliminar }),
      })
        .then((respuesta) => respuesta.json())
        .then(() => {
          setAutos(autos.filter((auto) => auto._id !== idAuto));
        });
    }
  };

  return (
    <div className="autos-container">
      <div className="cont-headers-admincars">
        <div class="cont-header-acctions">
          <button className="btn-agregar-auto" onClick={() => handleCrear()}>
            Agregar
          </button>
          <button
            className="btn-eliminar-auto"
            onClick={() => handleVerEliminados()}
          >
            {eliminado ? "Ver Activos" : "Ver Eliminados"}
          </button>
        </div>
        <div class="cont-filters">
          <h1 className="titulo-lista-autos">Lista de autos</h1>
          <input
            type="text"
            placeholder="Filtrar autos..."
            value={filtro}
            onChange={handleFiltroChange}
          />
        </div>
        <div class="cont-estadisticas">
          <p>
            <b>Total de autos:</b> {autos.length}
          </p>
          <p>
            <b>Autos en taller:</b>{" "}
            {autos.filter((auto) => auto.estadoActual === "En taller").length}
          </p>
          <p>
            <b>Autos en espera:</b>{" "}
            {autos.filter((auto) => auto.estadoActual === "En espera").length}
          </p>
          <p>
            <b>Autos entregados:</b>{" "}
            {autos.filter((auto) => auto.estadoActual === "Entregado").length}
          </p>
        </div>
      </div>
      {modoCrear && (
        <CrearAuto
          setAutos={setAutos}
          autos={autos}
          setModoCrear={setModoCrear}
          onCancelar={() => setModoCrear(false)}
        />
      )}
      <table>
        <thead>
          <tr className="tr-header">
            <th>Patente</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Aseguradora</th>
            <th>Siniestro</th>
            <th>Codigo de Color</th>
            <th>Fecha de Ingreso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9">Cargando...</td>
            </tr>
          ) : autosFiltrados.length ? (
            autosFiltrados.map((auto) => (
              <tr key={auto._id}>
                <td
                  className="patente"
                  onClick={() => handleVerDetalle(auto._id)}
                >
                  {auto.patente}
                </td>
                <td>{auto.marca}</td>
                <td>{auto.modelo}</td>
                <td>{auto.aseguradora}</td>
                <td>{auto.numeroSiniestro}</td>
                <td>{auto.codigoColor}</td>
                <td>{auto.fechaIngreso}</td>
                <td className="estado">{auto.estadoActual}</td>
                <td>
                  <Dropdown text="Opciones">
                    <DropdownMenu>
                      <Dropdown.Item
                        icon="eye"
                        text="Ver"
                        onClick={() => handleVerDetalle(auto._id)}
                      />
                      {eliminado ? (
                        <>
                          <Dropdown.Item
                            icon="undo"
                            text="Restaurar"
                            onClick={() =>
                              handleEliminar(auto._id, !auto.eliminado)
                            }
                          />
                          <Dropdown.Item
                            icon="trash"
                            text="Eliminar"
                            onClick={() =>
                              handleEliminarPermanentemente(auto._id)
                            }
                          />
                        </>
                      ) : (
                        <Dropdown.Item
                          icon="trash"
                          text="Eliminar"
                          onClick={() => handleEliminar(auto._id, true)}
                        />
                      )}
                      <Dropdown.Item
                        icon="file"
                        text="Ver Factura"
                        disabled={!auto.factura.length}
                        onClick={() => verFactura(auto.factura[0].url)}
                      />
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No se encontraron autos</td>
            </tr>
          )}
        </tbody>
      </table>
      {Object.entries(mostrarDetalles).map(([idAuto, mostrar]) => (
        <div
          key={idAuto}
          className={`detalles-auto ${mostrar ? "abierto" : "cerrado"}`}
        >
          <h2>Detalles del auto {idAuto}</h2>
          {/* Aquí puedes agregar más detalles del auto, como descripción, imágenes, etc. */}
          <button onClick={() => handleCerrarDetalles(idAuto)}>Cerrar</button>
        </div>
      ))}
    </div>
  );
}

export default AdminCars;
