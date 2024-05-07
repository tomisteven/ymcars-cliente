import React, { useState } from "react";
import "./CrearAuto.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_CREAR_AUTO = "http://localhost:8080/admin/clientes/crear"; // Reemplazar con la URL de tu API

function CrearAuto({ setAutos, setModoCrear, autos }) {
  const [nuevoAuto, setNuevoAuto] = useState({}); // Estado para almacenar los cambios realizados
  const [pdf, setPdf] = useState(null); // Estado para almacenar el archivo PDF
  const [loading, setLoading] = useState(false); // Estado para indicar si se está cargando la información

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevoAuto({ ...nuevoAuto, [name]: value }); // Actualizar el estado editado con el nuevo valor
  };

  const handleConfirmCreate = async () => {
    setLoading(true);
    const newAuto = {
      ...nuevoAuto,
      factura: pdf,
    };

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "token_ymcars_2024",
      },
    };
    try {
      const res = await axios.post(API_CREAR_AUTO, newAuto, config);
      if (res.data.ok) {
        toast.success("Auto creado exitosamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        autos.unshift(res.data.client);
        setModoCrear(false);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveImages = (name, file) => {
    setPdf(file);
  };

  return (
    <div className="crear-auto">
      <h2>Crear Nuevo Auto</h2>
      <p>
        <b>Patente:</b>
        <input
          type="text"
          name="patente"
          value={nuevoAuto.patente}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <b>Modelo:</b>
        <input
          type="text"
          name="modelo"
          value={nuevoAuto.modelo}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <b>Marca:</b>
        <input
          type="text"
          name="marca"
          value={nuevoAuto.marca}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <b>Aseguradora:</b>
        <input
          type="text"
          name="aseguradora"
          value={nuevoAuto.aseguradora}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <b>Nº Siniestro:</b>
        <input
          type="text"
          name="numeroSiniestro"
          value={nuevoAuto.numeroSiniestro}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <b>Código de Color:</b>
        <input
          type="text"
          name="codigoColor"
          value={nuevoAuto.codigoColor}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <b>Fecha de Ingreso:</b>
        <input
          type="date"
          name="fechaIngreso"
          value={nuevoAuto.fechaIngreso}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <b>Fecha de Egreso:</b>
        <input
          type="date"
          name="fechaEntrega"
          value={nuevoAuto.fechaEntrega}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <b>Estado:</b>
        <input
          type="text"
          name="estadoActual"
          value={nuevoAuto.estadoActual}
          onChange={handleInputChange}
        />
      </p>
      <p>
        <b>Factura (PDF):</b>
        <input
          type="file"
          id="factura"
          name="factura"
          onChange={(event) => {
            setPdf(event.target.files[0]);
            saveImages("factura", event.target.files[0]);
          }}
          accept=".pdf"
          required
        />
      </p>
      <div className="acciones">
        <button onClick={handleConfirmCreate}>
          {loading ? "Creando..." : "Crear"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CrearAuto;
