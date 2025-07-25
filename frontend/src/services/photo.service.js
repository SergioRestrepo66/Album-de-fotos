// Servicio de fotos

// Obtener todas las fotos
export function getPhotos() {
  return JSON.parse(localStorage.getItem('photos')) || [];
}

// Agregar una nueva foto
export function addPhoto(photo) {
  const photos = getPhotos();
  const newPhoto = { ...photo, id: Date.now() };
  photos.push(newPhoto);
  localStorage.setItem('photos', JSON.stringify(photos));
  return newPhoto;
}

// Función alternativa con el nombre que esperaba tu componente
export function createPhoto(photo) {
  return addPhoto(photo);
}

// Eliminar una foto por id
export function deletePhoto(photoId) {
  const photos = getPhotos().filter(photo => photo.id !== photoId);
  localStorage.setItem('photos', JSON.stringify(photos));
}

// Actualizar una foto por id
export function updatePhoto(photoId, updatedFields) {
  const photos = getPhotos().map(photo =>
    photo.id === photoId ? { ...photo, ...updatedFields } : photo
  );
  localStorage.setItem('photos', JSON.stringify(photos));
}