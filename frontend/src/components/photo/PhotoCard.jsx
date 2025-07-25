import React from "react";

const PhotoCard = ({ photo, onImageUpload = () => {}, onClick }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(photo.id, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onClick={() => onClick && onClick(photo)}
      style={{
        position: "relative",
        top: "-230px",
        zIndex: 1000,
        backgroundColor: "white",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        width: "250px", // Reducido de 300px a 250px
        height: "120px", // Reducido de 130px a 120px
        overflow: "hidden",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        cursor: "pointer", // Agregar cursor pointer para indicar que es clickeable
      }}
    >
      {/* Área de la foto */}
      <div
        style={{
          height: "120px", // Ajustado proporcionalmente
          cursor: "pointer",
          borderBottom: "1px solid #d1d5db",
        }}
      >
        {photo.image ? (
          <img
            src={photo.image}
            alt={photo.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f9fafb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              fontSize: "16px",
              fontWeight: "normal",
            }}
          >
            Foto
          </div>
        )}
      </div>

      {/* Área del nombre/país o región */}
      <div
        style={{
          height: "40px", // Ajustado proporcionalmente
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 8px",
          backgroundColor: "white",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#000000ff",
            textAlign: "center",
            fontWeight: "normal",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {photo.name || "País o Región"}
        </p>
      </div>

      {/* Input oculto para subir imagen */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        id={`file-${photo.id}`}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default PhotoCard;
