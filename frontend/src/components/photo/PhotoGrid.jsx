import React, { useState } from "react";
import PhotoCard from "./PhotoCard";
import PhotoModal from "./PhotoModal"; // Importar el modal

export default function PhotoGrid({ 
  photos, 
  onImageUpload, 
  onFetchPhotos, 
  onUpdatePhoto, 
  onDeletePhoto 
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Función para abrir el modal
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPhoto(null);
  };

  // Si no hay fotos, mostrar mensaje
  if (!photos || photos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-500 text-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onImageUpload={onImageUpload}
              onClick={handlePhotoClick} // Pasar la función onClick
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={handleCloseModal}
          onFetchPhotos={onFetchPhotos}
          onUpdatePhoto={onUpdatePhoto}
          onDeletePhoto={onDeletePhoto}
        />
      )}
    </div>
  );
}