import React, { useState } from "react";

const PhotoForm = ({ onSubmit, initialValues }) => {
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    date: initialValues?.date || "",
    description: initialValues?.description || "",
    imageFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="photo-form"
      style={{
        width: "445px",
        height: "400px",
        padding: "8px",
        boxSizing: "border-box",
      }}
    >
      {/* Título */}
      <div style={{ marginBottom: "8px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Título:
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="form-input"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #61ccfdff",
            borderRadius: "4px",
            fontSize: "14px",
            boxSizing: "border-box",
            transition: "border-color 0.3s ease",
          }}
        />
      </div>

      {/* Fecha */}
      <div style={{ marginBottom: "8px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Fecha:
        </label>
        
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="form-input"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #61ccfdff",
            borderRadius: "4px",
            fontSize: "14px",
            boxSizing: "border-box",
            transition: "border-color 0.3s ease",
          }}
        />
      </div>

      {/* Descripción */}
      <div style={{ marginBottom: "8px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Descripción:
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="form-input"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #61ccfdff",
            borderRadius: "4px",
            fontSize: "14px",
            resize: "none",
            boxSizing: "border-box",
            transition: "border-color 0.3s ease",
          }}
        />
      </div>

      {/* Imagen */}
      <div style={{ marginBottom: "8px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Imagen:
        </label>
        {/* Previsualización solo si initialValues.image existe */}
        {initialValues?.image && (
          <div style={{ marginBottom: "8px", textAlign: "center" }}>
            <img
              src={initialValues.image}
              alt="Previsualización"
              style={{
                maxWidth: "100%",
                maxHeight: "120px",
                borderRadius: "8px",
                margin: "0 auto"
              }}
            />
          </div>
        )}
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
          className="form-input"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #61ccfdff",
            borderRadius: "4px",
            fontSize: "12px",
            boxSizing: "border-box",
            transition: "border-color 0.3s ease",
          }}
        />
      </div>

      {/* Botón centrado */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}
      >
        <button
          type="submit"
          className="create-photo-btn"
          style={{
            width: "100%",
            padding: "10px",
            background: 'linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%)',
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "color 0.3s ease",
          }}
        >
          {initialValues ? 'Actualizar foto' : 'Crear foto'}
        </button>
      </div>

      {/* Estilos CSS Responsive */}
      <style>{`
        /* Móvil (hasta 767px) */
        @media (max-width: 767.98px) {
          .photo-form {
            width: 100% !important;
            height: auto !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 1rem !important;
          }
          
          .photo-form > div {
            display: flex !important;
            flex-direction: column !important;
            gap: 0.5rem !important;
            margin-bottom: 1rem !important;
          }
          
          .photo-form > div > div {
            width: 100% !important;
            flex: none !important;
          }
          
          .photo-form label {
            margin: 0 !important;
            font-size: 12px !important;
            margin-bottom: 2px !important;
          }
          
          .photo-form input,
          .photo-form textarea {
            width: 100% !important;
            margin: 0 !important;
            padding: 6px !important;
            font-size: 12px !important;
            border: 1px solid #4fc3f7 !important;
            border-radius: 2px !important;
            box-sizing: border-box !important;
            transition: border-color 0.3s ease !important;
          }
          
          .photo-form button {
            width: 100% !important;
            padding: 6px 12px !important;
            font-size: 12px !important;
            background: 'linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%)',
          }
        }

        /* Efecto hover para el botón */
        .create-photo-btn:hover {
          color: #0d2346 !important;
        }

        /* Efecto focus para los inputs */
        .form-input:focus {
          outline: none !important;
          border-color: #0d2346 !important;
          box-shadow: 0 0 0 2px rgba(13, 35, 70, 0.2) !important;
        }

        /* Efecto focus para móvil */
        @media (max-width: 767.98px) {
          .photo-form input:focus,
          .photo-form textarea:focus {
            outline: none !important;
            border-color: #0d2346 !important;
            box-shadow: 0 0 0 2px rgba(13, 35, 70, 0.2) !important;
          }
        }
        }
      `}</style>
    </form>
  );
};

export default PhotoForm;