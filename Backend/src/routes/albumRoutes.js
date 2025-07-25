const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumControllers');

router.post('/albumId/photos', albumController.createPhoto);
router.get('/albumId/photos', albumController.getPhotos);
router.put('/albumId/photos/:photoId', albumController.updatePhoto);
router.delete('/albumId/photos/:photoId', albumController.deletePhoto);

module.exports = router;