import { useState } from 'react';

// Hook para manejar el estado de las fotos
export const usePhotos = (initialPhotos = []) => {
  const [photos, setPhotos] = useState(initialPhotos);

  const addPhoto = (photo) => setPhotos([...photos, photo]);
  const removePhoto = (photoId) => setPhotos(photos.filter(p => p.id !== photoId));

  return { photos, addPhoto, removePhoto };
};
