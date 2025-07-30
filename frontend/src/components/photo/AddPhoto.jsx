import React, { useState, useRef, useEffect, useCallback } from "react";
import PhotoForm from "../photo/PhotoForm";
import PhotoModal from "../photo/PhotoModal";

// 1. Configuración de IndexedDB
const setupIndexedDB = () => {
  return new Promise((resolve) => {
    const request = indexedDB.open("PhotosDatabase", 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = () => resolve(null);
  });
};

// 2. Funciones de respaldo con localStorage (SÍNCRONAS)
const saveToLocalStorage = (photos) => {
  try {
    localStorage.setItem('photosBackup', JSON.stringify(photos));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const backup = localStorage.getItem('photosBackup');
    return backup ? JSON.parse(backup) : [];
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return [];
  }
};

// 3. Funciones para manejar el estado del modal (SÍNCRONAS)
const saveModalState = (modalState) => {
  try {
    sessionStorage.setItem('modalState', JSON.stringify(modalState));
  } catch (error) {
    console.error("Error saving modal state:", error);
  }
};

const loadModalState = () => {
  try {
    const cachedModal = sessionStorage.getItem('modalState');
    return cachedModal ? JSON.parse(cachedModal) : { showModal: false, selectedPhoto: null };
  } catch (error) {
    console.error("Error loading modal state:", error);
    return { showModal: false, selectedPhoto: null };
  }
};

// 4. Store mejorado para carga inicial síncrona
class PhotoStore {
  constructor() {
    // Cargar TODO el estado inicial de forma SÍNCRONA
    this.photos = loadFromLocalStorage();
    this.modalState = loadModalState();
    this.listeners = new Set();
    this.modalListeners = new Set();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      const db = await setupIndexedDB();
      if (db) {
        const tx = db.transaction('photos', 'readonly');
        const store = tx.objectStore('photos');
        
        const loadedPhotos = await new Promise((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        });
        
        // Solo actualizar si IndexedDB tiene más fotos que localStorage
        if (loadedPhotos.length > this.photos.length) {
          this.photos = loadedPhotos;
          saveToLocalStorage(loadedPhotos);
          this.notifyPhotosListeners();
        }
      }
    } catch (error) {
      console.error("Error initializing PhotoStore:", error);
    }
    
    this.isInitialized = true;
  }

  // Suscripciones para fotos
  subscribeToPhotos(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyPhotosListeners() {
    this.listeners.forEach(listener => listener(this.photos));
  }

  // Suscripciones para modal
  subscribeToModal(listener) {
    this.modalListeners.add(listener);
    return () => this.modalListeners.delete(listener);
  }

  notifyModalListeners() {
    this.modalListeners.forEach(listener => listener(this.modalState));
  }

  // Métodos para actualizar fotos
  async updatePhotos(newPhotos) {
    this.photos = newPhotos;
    saveToLocalStorage(newPhotos);
    this.notifyPhotosListeners();
    
    // Guardar en IndexedDB en segundo plano
    try {
      const db = await setupIndexedDB();
      if (db) {
        const tx = db.transaction('photos', 'readwrite');
        const store = tx.objectStore('photos');
        
        await new Promise((resolve, reject) => {
          store.clear();
          newPhotos.forEach(photo => store.put(photo));
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      }
    } catch (error) {
      console.error("Error persisting photos:", error);
    }
  }

  // Métodos para actualizar modal
  updateModalState(newModalState) {
    this.modalState = newModalState;
    saveModalState(newModalState);
    this.notifyModalListeners();
  }

  // Getters síncronos
  getPhotos() {
    return this.photos;
  }

  getModalState() {
    return this.modalState;
  }
}

// Instancia global del store
const photoStore = new PhotoStore();

const AddPhoto = () => {
  // 5. Estado inicial SIEMPRE cargado de forma SÍNCRONA (sin parpadeos)
  const [photos, setPhotos] = useState(() => photoStore.getPhotos());
  const [modalState, setModalState] = useState(() => photoStore.getModalState());
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const buttonRef = useRef(null);

  // Configuración de paginación
  const photosPerPage = 8; // 8 fotos por página
  const totalPages = Math.ceil(photos.length / photosPerPage);
  const startIndex = (currentPage - 1) * photosPerPage;
  const endIndex = startIndex + photosPerPage;
  const currentPhotos = photos.slice(startIndex, endIndex);

  // Elimina window.scrollTo de los handlers y agrégalo aquí:
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // 6. Suscribirse a cambios de fotos (SIN CONFLICTOS)
  useEffect(() => {
    const unsubscribe = photoStore.subscribeToPhotos((newPhotos) => {
      setPhotos(newPhotos);
      // Si la página actual no tiene fotos, ir a la última página
      const newTotalPages = Math.ceil(newPhotos.length / photosPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    });

    return unsubscribe;
  }, [currentPage]); // Agregar currentPage como dependencia

  // 7. Suscribirse a cambios del modal (SIN CONFLICTOS)
  useEffect(() => {
    const unsubscribe = photoStore.subscribeToModal((newModalState) => {
      // Solo actualizar si el estado es diferente para evitar bucles
      if (JSON.stringify(newModalState) !== JSON.stringify(modalState)) {
        setModalState(newModalState);
      }
    });

    return unsubscribe;
  }, [modalState]); // Agregar modalState como dependencia

  // 8. Inicializar el store en segundo plano (UNA SOLA VEZ)
  useEffect(() => {
    const timer = setTimeout(() => {
      photoStore.initialize();
      // Ocultar loading después de 1.5 segundos
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 9. Función para obtener la posición del botón
  const getButtonPosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      };
    }
    return { top: 0, left: 0 };
  }, []);

  // 10. Funciones de paginación
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
      }, 2000);
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  // Función para crear una nueva página
  const createNewPage = useCallback(() => {
    setCurrentPage(totalPages + 1);
  }, [totalPages]);

  // 11. Funciones para manejar fotos
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleAddPhoto = async (photoData) => {
    try {
      let imageBase64 = null;
      let imageName = '';
      if (photoData.imageFile) {
        imageBase64 = await getBase64(photoData.imageFile);
        imageName = photoData.imageFile.name;
      }

      const newPhoto = {
        id: Date.now(),
        name: photoData.title,
        date: photoData.date,
        description: photoData.description,
        image: imageBase64,
        imageName: imageName,
      };

      const updatedPhotos = [...photos, newPhoto];
      await photoStore.updatePhotos(updatedPhotos);
      setPhotos(updatedPhotos); // Actualiza el estado local inmediatamente
      setShowForm(false);

      // Verificar si la página actual se completó y navegar automáticamente
      const newTotalPages = Math.ceil(updatedPhotos.length / photosPerPage);
      const currentPagePhotos = updatedPhotos.slice(startIndex, endIndex);
      
      // Si la página actual se llenó y estamos en la última página, ir a la siguiente
      if (currentPagePhotos.length >= photosPerPage && currentPage === totalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      setError("Error al añadir la foto. Inténtalo de nuevo.");
      console.error("Error adding photo:", err);
    }
  };

  const handleDeletePhoto = async (id) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    await photoStore.updatePhotos(updatedPhotos);
    handleCloseModal();
  };

  const handleUpdatePhoto = async (id, updatedData) => {
    let imageBase64 = modalState.selectedPhoto.image;
    
    if (updatedData.imageFile) {
      imageBase64 = await getBase64(updatedData.imageFile);
    }

    const updatedPhoto = {
      ...modalState.selectedPhoto,
      name: updatedData.title,
      date: updatedData.date,
      description: updatedData.description,
      image: imageBase64
    };

    const updatedPhotos = photos.map(photo => 
      photo.id === id ? updatedPhoto : photo
    );
    
    await photoStore.updatePhotos(updatedPhotos);
    
    // Actualizar el modal con la foto actualizada
    setModalState({
      showModal: true,
      selectedPhoto: updatedPhoto
    });
  };

  // 12. Funciones para manejar el modal
  const handlePhotoClick = useCallback((photo) => {
    setModalState({
      showModal: true,
      selectedPhoto: photo
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({
      showModal: false,
      selectedPhoto: null
    });
  }, []);

  // 13. Función para manejar el click del botón
  const handleButtonClick = useCallback(() => {
    const position = getButtonPosition();
    setButtonPosition(position);
    setShowForm(true);
  }, [getButtonPosition]);

  // 14. Generar grid items (memoizado para evitar recálculos innecesarios)
  const gridItems = React.useMemo(() => {
    const maxFotosPorPagina = 8;
    const items = [...currentPhotos];

    // Si hay menos de 8 fotos, el botón va en la última columna
    if (currentPhotos.length < maxFotosPorPagina) {
      items.push({ isButton: true, id: `button-page-${currentPage}-${photos.length}` });
    }

    // Rellenar con placeholders para mantener 8 elementos (2 filas x 4 columnas)
    while (items.length < maxFotosPorPagina) {
      items.push({ isPlaceholder: true, id: `placeholder-${items.length}` });
    }

    return items;
  }, [currentPhotos, currentPage, photos.length]);

  // 15. Render principal
  return (
    <div 
      className="album-container"
      style={{ padding: "20px", paddingTop: "90px", paddingBottom: "100px", position: "relative" }}
    >
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <div className="loading-text">Cargando fotos...</div>
        </div>
      )}
      {error && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid #f5c6cb",
          zIndex: 9999,
          maxWidth: "300px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: "10px",
              background: "none",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "#721c24"
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Grid de fotos - SIEMPRE visible sin parpadeos */}
      <div 
        className="photo-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", // 4 columnas fijas
          // gridTemplateRows eliminado para que la altura de las filas se ajuste automáticamente
          gap: "80px 70px",
          width: "100%",
          marginTop: "140px",
          marginBottom: "40px"
        }}
      >
        {gridItems.map((item) => {
          if (item.isButton) {
            return (
              <div
                key={item.id}
                ref={buttonRef}
                onClick={handleButtonClick}
                className="add-photo-button"
                style={{
                  width: "100%",
                  height: "200px",
                  border: "3px dashed #007bff",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundColor: "#f8f9fa",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#007bff",
                  marginBottom: "10px",
                  textAlign: "center"
                }}>
                  Añadir foto
                </div>
                <div 
                  className="add-photo-icon"
                  style={{
                    fontSize: "48px",
                    color: "#007bff",
                    fontWeight: "300"
                  }}
                >
                  +
                </div>
              </div>
            );
          }
          if (item.isPlaceholder) {
            // Espacio vacío para mantener la estructura del grid
            return <div key={item.id} style={{ width: "100%", height: "200px", background: "transparent" }}></div>;
          }
          return (
            <div 
              key={item.id} 
              className="photo-card"
              style={{ 
                width: "100%", 
                height: "100%",
                cursor: "pointer"
              }}
              onClick={() => handlePhotoClick(item)}
            >
              <div style={{ 
                width: "100%", 
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                border: "1px solid #e8e8e8"
              }}>
                <div style={{
                  flex: 1,
                  overflow: "hidden",
                  borderRadius: "16px 16px 0 0",
                  margin: "6px 6px 0 6px"
                }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px"
                    }}
                  />
                </div>
                <div style={{
                  padding: "12px 16px 16px 16px",
                  textAlign: "center",
                  backgroundColor: "white"
                }}>
                  <div style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#333",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {item.name}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botones de navegación - aparecen desde la primera página */}
      {(currentPage > 1 || currentPhotos.length === 8) && (
        <div 
          className="navigation-buttons"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            marginTop: "30px",
            marginBottom: "20px"
          }}
        >
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{
              background: currentPage === 1 ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "20px",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }
            }}
          >
            ←
          </button>
          <div style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            minWidth: "80px",
            textAlign: "center"
          }}>
            Página {currentPage}
          </div>
          <button
            onClick={currentPage === totalPages ? createNewPage : handleNextPage}
            disabled={currentPhotos.length < 8}
            style={{
              background: currentPhotos.length < 8 ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: currentPhotos.length < 8 ? "not-allowed" : "pointer",
              fontSize: "20px",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              if (currentPhotos.length >= 8) {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPhotos.length >= 8) {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }
            }}
          >
            +
          </button>
        </div>
      )}

      {/* Formulario - siempre en la posición del botón */}
      {showForm && (
        <div
          className="form-container"
          style={{
            position: "absolute",
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`,
            width: "310px",
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid #ddd",
            marginTop: "calc(2rem - 73px)",
            marginLeft: '-2px',
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "2rem"
          }}
        >
          <PhotoForm onSubmit={handleAddPhoto} />
        </div>
      )}

      {/* Overlay de fondo desenfocado para móvil */}
      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}></div>
      )}

      {/* Modal - SIEMPRE renderizado sin parpadeos */}
      {modalState.showModal && modalState.selectedPhoto && (
        <PhotoModal
          photo={modalState.selectedPhoto}
          onClose={handleCloseModal}
          onDeletePhoto={handleDeletePhoto}
          onUpdatePhoto={handleUpdatePhoto}
        />
      )}

      {/* Estilos CSS Responsive */}
      <style>{`
        /* Loading Screen */
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.95);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #e3f2fd;
          border-top: 4px solid #1976d2;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .loading-text {
          font-size: 18px;
          font-weight: 500;
          color: #1976d2;
          text-align: center;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Móvil (hasta 767px) */
        @media (max-width: 767.98px) {
          .loading-spinner {
            width: 50px !important;
            height: 50px !important;
            border-width: 3px !important;
            margin-bottom: 15px !important;
          }
          
          .loading-text {
            font-size: 16px !important;
          }
          
          .photo-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
            margin-bottom: 2rem !important;
            margin-top: 0px !important;
          }
          .photo-card {
            height: 200px !important;
          }
          .add-photo-button {
            width: 100% !important;
            height: 180px !important;
            font-size: 14px !important;
          }
          .add-photo-icon {
            font-size: 36px !important;
          }
          .album-container {
            padding-bottom: 120px !important;
          }
          
          /* Botones de navegación en móvil */
          .navigation-buttons {
            gap: 15px !important;
            margin-top: 20px !important;
            margin-bottom: 15px !important;
          }
          
          .navigation-buttons button {
            width: 45px !important;
            height: 45px !important;
            font-size: 18px !important;
          }
          
          .navigation-buttons div {
            font-size: 14px !important;
            min-width: 60px !important;
          }
          
          /* Overlay de fondo desenfocado */
          .form-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(5px) !important;
            -webkit-backdrop-filter: blur(5px) !important;
            z-index: 999 !important;
          }
          
          /* Formulario centrado en móvil */
          .form-container {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 90% !important;
            max-width: 350px !important;
            height: auto !important;
            min-height: 400px !important;
            margin: 0 !important;
            border-radius: 16px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
            z-index: 1000 !important;
            background: white !important;
            padding: 1.5rem !important;
          }
        }

        /* Tablet (768px - 991px) */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .loading-spinner {
            width: 70px !important;
            height: 70px !important;
            border-width: 5px !important;
            margin-bottom: 25px !important;
          }
          
          .loading-text {
            font-size: 20px !important;
          }
          
          .photo-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 18px !important;
            margin-bottom: 2rem !important;
            margin-top: 0px !important;
          }
          .photo-card {
            height: 220px !important;
          }
          .add-photo-button {
            width: 100% !important;
            height: 200px !important;
            font-size: 15px !important;
          }
          .add-photo-icon {
            font-size: 42px !important;
          }
          .album-container {
            padding-bottom: 100px !important;
          }
          
          /* Botones de navegación en tablet */
          .navigation-buttons {
            gap: 25px !important;
            margin-top: 25px !important;
            margin-bottom: 20px !important;
          }
          
          .navigation-buttons button {
            width: 55px !important;
            height: 55px !important;
            font-size: 22px !important;
          }
          
          .navigation-buttons div {
            font-size: 18px !important;
            min-width: 90px !important;
          }
          
          /* Overlay de fondo desenfocado para tablet */
          .form-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            z-index: 999 !important;
          }
          
          /* Formulario centrado en tablet */
          .form-container {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 85% !important;
            max-width: 510px !important;
            height: auto !important;
            min-height: 480px !important;
            margin: 0 !important;
            border-radius: 16px !important;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3) !important;
            z-index: 1000 !important;
            background: white !important;
            padding: 2rem !important;
          }
        }

        /* Desktop (992px en adelante) */
        @media (min-width: 992px) {
          .photo-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 20px !important;
            margin-bottom: 2rem !important;
            margin-top: 0px !important;
          }
          .photo-card {
            height: 250px !important;
          }
          .add-photo-button {
            width: 100% !important;
            height: 200px !important;
            font-size: 16px !important;
          }
          .add-photo-icon {
            font-size: 48px !important;
          }
          .album-container {
            padding-bottom: 80px !important;
          }
          
          /* Botones de navegación en desktop */
          .navigation-buttons {
            gap: 30px !important;
            margin-top: 30px !important;
            margin-bottom: 25px !important;
          }
          
          .navigation-buttons button {
            width: 60px !important;
            height: 60px !important;
            font-size: 24px !important;
          }
          
          .navigation-buttons div {
            font-size: 20px !important;
            min-width: 100px !important;
          }
          
          /* Formulario centrado en PC */
          .form-container {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 500px !important;
            height: auto !important;
            min-height: 450px !important;
            margin: 0 !important;
            border-radius: 16px !important;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3) !important;
            z-index: 1000 !important;
            background: white !important;
            padding: 2rem !important;
          }
          
          /* Overlay de fondo desenfocado para PC */
          .form-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(5px) !important;
            -webkit-backdrop-filter: blur(5px) !important;
            z-index: 999 !important;
          }
                }
        `}</style>
    </div>
  );
};

export default AddPhoto;