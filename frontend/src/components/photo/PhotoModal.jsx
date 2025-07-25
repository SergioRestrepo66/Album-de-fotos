import React, { useState, useCallback, useMemo } from "react";
import PhotoForm from "./PhotoForm";
import AddPhoto from "./AddPhoto";

// Modal con detalles de foto y acciones - Optimizado para evitar problemas de memoria
const PhotoModal = ({
  photo,
  onClose,
  onFetchPhotos,
  onUpdatePhoto,
  onDeletePhoto,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [flipped, setFlipped] = useState(false);

  // Memoizar handlers para evitar re-renders innecesarios
  const handleClose = useCallback(() => {
    setIsEditing(false);
    setIsDeleted(false);
    setShowAddPhoto(false);
    setFlipped(false);
    onClose();
  }, [onClose]);

  const handleFetchAndClose = useCallback(() => {
    if (onFetchPhotos) onFetchPhotos();
    handleClose();
  }, [onFetchPhotos, handleClose]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (onDeletePhoto) onDeletePhoto(photo.id);
    setIsDeleted(true);
    setShowAddPhoto(true);
  }, [onDeletePhoto, photo?.id]);

  const handleUpdateSubmit = useCallback((updatedData) => {
    if (onUpdatePhoto) onUpdatePhoto(photo.id, updatedData);
    setIsEditing(false);
  }, [onUpdatePhoto, photo?.id]);

  const handlePhotoAdded = useCallback(() => {
    setIsDeleted(false);
    setShowAddPhoto(false);
  }, []);

  // Memoizar valores iniciales del formulario
  const initialFormValues = useMemo(() => ({
    title: photo?.name || '',
    description: photo?.description || '',
    date: photo?.date || '',
    imageFile: null,
  }), [photo?.name, photo?.description, photo?.date]);

  // Estilos memoizados
  const modalOverlayStyle = useMemo(() => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  }), []);

  const modalContentStyle = useMemo(() => ({
    background: "white",
    borderRadius: "12px",
    padding: "2rem",
    minWidth: "350px",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
    position: "relative",
  }), []);

  if (!photo && !isDeleted && !showAddPhoto) return null;

  // Estado de eliminado
  if (isDeleted) {
    return (
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <AddPhoto onPhotoAdded={handlePhotoAdded} />
        </div>
      </div>
    );
  }

  // Estado de edición
  if (isEditing) {
    return (
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            ×
          </button>
          <PhotoForm
            initialValues={initialFormValues}
            onSubmit={handleUpdateSubmit}
          />
        </div>
      </div>
    );
  }

  // Vista principal del modal
  return (
    <div style={modalOverlayStyle}>
      <div
        className="modal-content"
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "2rem",
          width: "700px",
          height: "400px",
          display: "flex",
          flexDirection: "row",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        <button
          className="modal-close-btn"
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ×
        </button>
        
        {/* Lado izquierdo: Descripción y botones */}
        <div
          className="modal-left"
          style={{
            width: "320px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            marginRight: "2rem",
          }}
        >
          <div
            style={{
              fontSize: "17px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Descripción
          </div>
          <div
            style={{
              width: "100%",
              height: "220px",
              overflowY: "auto",
              padding: "12px",
              border: "1px solid #e8e8e8",
              borderRadius: "8px",
              background: "#f9f9f9",
              fontSize: "15px",
              color: "#444",
              marginBottom: "30px",
              cursor: "text",
              lineHeight: "1.5",
              scrollbarWidth: "thin",
              scrollbarColor: "#c1c1c1 #f1f1f1",
            }}
            tabIndex={0}
          >
            {photo?.description}
          </div>
          
          {/* Botones de acción */}
          <div
            className="modal-buttons"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              marginTop: "auto",
            }}
          >
            <button
              style={{
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                fontWeight: "bold",
                cursor: "pointer",
                flex: 1,
                fontSize: "14px",
                transition: "background-color 0.2s",
              }}
              onClick={handleFetchAndClose}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
            >
              Traer
            </button>
            <button
              style={{
                background: "#ffc107",
                color: "#333",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                fontWeight: "bold",
                cursor: "pointer",
                flex: 1,
                fontSize: "14px",
                transition: "background-color 0.2s",
              }}
              onClick={handleEdit}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#e0a800"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#ffc107"}
            >
              Actualizar
            </button>
            <button
              style={{
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                fontWeight: "bold",
                cursor: "pointer",
                flex: 1,
                fontSize: "14px",
                transition: "background-color 0.2s",
              }}
              onClick={handleDelete}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"}
            >
              Eliminar
            </button>
          </div>
        </div>

        {/* Lado derecho: Tarjeta con efecto flip */}
        <div
          className="modal-right"
          style={{
            width: "320px",
            height: "320px",
            marginTop: "20px",
            perspective: "1000px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              border: "1px solid #e8e8e8",
              backgroundColor: "white",
              transformStyle: "preserve-3d",
              transition: "transform 0.6s",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              position: "relative",
            }}
          >
            {/* Cara frontal */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={photo?.image}
                alt={photo?.name}
                style={{
                  position: "relative",
                  width: "90%",
                  height: "80%",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginTop: "16px",
                }}
              />
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#333",
                  marginTop: "6px",
                  textAlign: "center",
                }}
              >
                {photo?.name}
              </div>
            </div>
            {/* Cara trasera */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                backgroundColor: "#f8f9fa",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotateY(180deg)",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  color: "#007bff",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Fecha
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: "#333",
                }}
              >
                {photo?.date}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estilos CSS Responsive */}
      <style>{`
        /* Scrollbar personalizado */
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }

        /* Móvil (hasta 767px) */
        @media (max-width: 767.98px) {
          .modal-content {
            width: 90% !important;
            max-width: 400px !important;
            height: auto !important;
            min-height: 500px !important;
            flex-direction: column !important;
            padding: 1.5rem !important;
            margin: 20px !important;
            position: relative !important;
          }
          
          .modal-close-btn {
            top: 0 !important;
            right: 0 !important;
            width: 40px !important;
            height: 40px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: transparent !important;
            border: none !important;
            font-size: 1.8rem !important;
            font-weight: bold !important;
            color: #333 !important;
            box-shadow: none !important;
          }
          
          .modal-left {
            width: 100% !important;
            margin-right: 0 !important;
            order: 2 !important;
          }
          
          .modal-right {
            width: 100% !important;
            height: 250px !important;
            margin-top: 0 !important;
            margin-bottom: 1.5rem !important;
            order: 1 !important;
            cursor: pointer !important;
          }
          
          /* En móvil, deshabilitar hover y usar solo click */
          .modal-right:hover {
            transform: none !important;
          }
          
          .modal-buttons {
            flex-direction: column !important;
            gap: 10px !important;
            margin-top: 1rem !important;
          }
          
          .modal-buttons button {
            width: 100% !important;
            padding: 12px !important;
            font-size: 16px !important;
          }
        }

        /* Tablet (768px - 991px) */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .modal-content {
            width: 85% !important;
            max-width: 600px !important;
            height: auto !important;
            min-height: 450px !important;
            padding: 2rem !important;
          }
          
          .modal-left {
            width: 45% !important;
            margin-right: 1.5rem !important;
          }
          
          .modal-right {
            width: 45% !important;
            height: 280px !important;
          }
        }

        /* Desktop (992px en adelante) */
        @media (min-width: 992px) {
          .modal-content {
            width: 700px !important;
            height: 400px !important;
            flex-direction: row !important;
            padding: 2rem !important;
          }
          
          .modal-left {
            width: 320px !important;
            margin-right: 2rem !important;
            order: 1 !important;
          }
          
          .modal-right {
            width: 320px !important;
            height: 320px !important;
            margin-top: 20px !important;
            order: 2 !important;
            cursor: pointer !important;
          }
          
          /* En desktop, mantener hover */
          .modal-right:hover {
            transform: none !important;
          }
          
          .modal-buttons {
            flex-direction: row !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoModal;