import React, { useState } from "react";
import "./CrearAuto.css";
import axios from "axios";
import request from "superagent";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon, Label } from "semantic-ui-react";

const API_CREAR_AUTO = "http://localhost:8080/admin/clientes/crear"; // Reemplazar con la URL de tu API

function CrearAuto({ setAutos, setModoCrear, autos }) {
  const [nuevoAuto, setNuevoAuto] = useState({}); // Estado para almacenar los cambios realizados
  const [nuevoDaño, setNuevoDaño] = useState("");
  const [daniosRecibidos, setDaños] = useState([]);
  const [pdf, setPdf] = useState(null); // Estado para almacenar el archivo PDF
  const [loading, setLoading] = useState(false); // Estado para indicar si se está cargando la información

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevoAuto({ ...nuevoAuto, [name]: value.toUpperCase() }); // Actualizar el estado editado con el nuevo valor
  };

  const handleConfirmCreate = async () => {
    setLoading(true);

    if (pdf) {
      pdf.size > 2048576 && alert("El archivo es demasiado grande");
    }

    let newAuto = {};

    if (pdf) {
      newAuto = {
        ...nuevoAuto,
        factura: pdf,
      };
    } else {
      newAuto = {
        ...nuevoAuto,
      };
    }

    const formData = new FormData();
    for (const key in newAuto) {
      formData.append(key, newAuto[key]);
    }

    // Agregar el array de daños como un string JSON
    formData.append("daniosRecibidos", JSON.stringify(daniosRecibidos));

    try {
      // Intenta con Axios
      const axiosResponse = await axios.post(API_CREAR_AUTO, formData, {
        headers: {
          Authorization: "token_ymcars_2024",
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(axiosResponse);
      if (axiosResponse.data.ok) {
        handleSuccess(axiosResponse.data.client);
      }
    } catch (axiosError) {
      console.error("Error con Axios:", axiosError);
      // Si Axios falla, intenta con Fetch
      try {
        const fetchResponse = await fetch(API_CREAR_AUTO, {
          method: "POST",
          headers: {
            Authorization: "token_ymcars_2024",
          },
          body: formData,
        });
        if (fetchResponse.ok) {
          const responseData = await fetchResponse.json();
          if (responseData.ok) {
            handleSuccess(responseData.client);
            return; // Evita continuar con Superagent si Fetch tiene éxito
          }
        }
      } catch (fetchError) {
        console.error("Error con Fetch:", fetchError);
      }
      // Si Fetch también falla, intenta con Superagent
      try {
        const superagentResponse = await request
          .post(API_CREAR_AUTO)
          .set("Authorization", "token_ymcars_2024")
          .send(formData);

        if (superagentResponse.body.ok) {
          handleSuccess(superagentResponse.body.client);
          return; // Evita continuar si Superagent tiene éxito
        }
      } catch (superagentError) {
        console.error("Error con Superagent:", superagentError);
      }
      // Si todos los métodos fallan, muestra un mensaje de error
      handleError();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChangeDaño = (event) => {
    setNuevoDaño(event.target.value);
  };

  const agregarDaño = () => {
    if (nuevoDaño.trim()) {
      setDaños([...daniosRecibidos, { descripcion: nuevoDaño }]);
      setNuevoDaño("");
      console.log(daniosRecibidos);
    }
  };

  const handleSuccess = (client) => {
    toast.success("Auto creado exitosamente", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    autos.unshift(client);
    setModoCrear(false);
  };

  const handleError = () => {
    toast.error("Error al crear el auto. Por favor, inténtalo de nuevo.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
        <b>Llego con estos daños:</b>
        <input
          type="text"
          name="daño"
          value={nuevoDaño}
          onChange={handleInputChangeDaño}
        />
        <button onClick={agregarDaño}>Agregar</button>
      </p>
      <p>
        <b>Daños:</b>
        <ul className="ul-daños-item">
          {daniosRecibidos &&
            daniosRecibidos.map((daño, index) => (
              <Label size="large" className="item-daño">
                {daño.descripcion}
                <Icon
                  name="delete"
                  color="red"
                  onClick={() => {
                    daniosRecibidos.splice(index, 1);
                    setDaños([...daniosRecibidos]);
                  }}
                />
              </Label>
            ))}
        </ul>
      </p>
      <p>
        <b>Factura (PDF):</b>
        <input
          size="2048576"
          type="file"
          id="factura"
          name="factura"
          onChange={(event) => {
            event.target.files[0].size > 2048576
              ? alert(
                  "El archivo es demasiado grande, seleccione OTRO archivo PDF de menos de 2MB"
                )
              : setPdf(event.target.files[0]);
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
    </div>
  );
}

export default CrearAuto;
