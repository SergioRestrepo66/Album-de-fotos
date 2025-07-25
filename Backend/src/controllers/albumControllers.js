const Album = require("../models/album");
const Photo = require("../models/album"); // ← AGREGAR ESTA LÍNEA
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

exports.createPhoto = async (req, res) => {
  try {
    // Permitir imagen por archivo o por URL
    if (!req.file && !req.body.imageUrl) {
      return res.status(400).json({
        success: false,
        error: "Debe seleccionar una imagen o proporcionar una URL",
      });
    }

    if (!req.body.title || !req.body.date) {
      if (req.file?.path) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Los campos "Nombre del Lugar" y "Fecha" son requeridos',
      });
    }

    // Si se envía albumId, verifica que exista, si no, continúa sin álbum
    let albumId = req.params.albumId || null;
    if (albumId) {
      const album = await Album.findOne({
        _id: albumId,
        user: req.userId,
      });
      if (!album) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        return res.status(404).json({
          success: false,
          error: "Álbum no encontrado",
        });
      }
    }

    let imageUrl = req.body.imageUrl || "";
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const filename = `${uuidv4()}${ext}`;
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const newPath = path.join(uploadDir, filename);
      fs.renameSync(req.file.path, newPath);
      imageUrl = `/uploads/${filename}`;
    }

    // Crear la foto (album puede ser null)
    const photo = await Photo.create({ // ← CAMBIAR photo por Photo
      title: req.body.title,
      description: req.body.description || "",
      date: req.body.date,
      imageUrl,
      album: albumId,
      user: req.userId,
    });

    res.status(201).json({
      success: true,
      data: {
        id: photo._id,
        title: photo.title,
        description: photo.description,
        date: photo.date,
        imageUrl: photo.imageUrl,
      },
    });
  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    console.error("Error al crear foto:", error);
    res.status(500).json({
      success: false,
      error: "Error al guardar la foto",
    });
  }
};

// 2. Obtener todas las fotos de un álbum
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ // ← CAMBIAR photos por Photo
      album: req.params.albumId,
      user: req.userId,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: photos.map((photo) => ({
        id: photo._id,
        title: photo.title,
        description: photo.description,
        date: photo.date,
        imageUrl: photo.imageUrl,
      })),
    });
  } catch (error) {
    console.error("Error al obtener fotos:", error);
    res.status(500).json({
      success: false,
      error: "Error al cargar las fotos",
    });
  }
};

// 3. Actualizar foto
exports.updatePhoto = async (req, res) => {
  try {
    // Buscar foto existente
    const photo = await Photo.findOne({ // ← CAMBIAR photo por Photo
      _id: req.params.photoId,
      album: req.params.albumId,
      user: req.userId,
    });

    if (!photo) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        error: "Foto no encontrada",
      });
    }

    let newImageUrl = photo.imageUrl;
    let oldImagePath = null;

    // Procesar nueva imagen si existe
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const filename = `${uuidv4()}${ext}`;
      const uploadDir = path.join(__dirname, "../uploads");
      const newPath = path.join(uploadDir, filename);
      fs.renameSync(req.file.path, newPath);
      newImageUrl = `/uploads/${filename}`;
      oldImagePath = photo.imageUrl;
    } else if (req.body.imageUrl) {
      // Si envías una nueva URL, actualiza el campo
      newImageUrl = req.body.imageUrl;
    }

    // Validar campos requeridos
    if (!req.body.title || !req.body.date) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Los campos "Nombre del Lugar" y "Fecha" son requeridos',
      });
    }

    // Actualizar datos
    const updatedPhoto = await Photo.findByIdAndUpdate( // ← CAMBIAR photo por Photo
      req.params.photoId,
      {
        title: req.body.title,
        description: req.body.description || "",
        date: req.body.date,
        imageUrl: newImageUrl,
      },
      { new: true }
    );

    // Eliminar imagen anterior si se subió nueva
    if (oldImagePath) {
      const fullPath = path.join(__dirname, "..", oldImagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        id: updatedPhoto._id,
        title: updatedPhoto.title,
        description: updatedPhoto.description,
        date: updatedPhoto.date,
        imageUrl: updatedPhoto.imageUrl,
      },
    });
  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    console.error("Error al actualizar foto:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar la foto",
    });
  }
};

// 4. Eliminar foto
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findOneAndDelete({ // ← CAMBIAR photo por Photo
      _id: req.params.photoId,
      album: req.params.albumId,
      user: req.userId,
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: "Foto no encontrada",
      });
    }

    // Eliminar archivo físico
    if (photo.imageUrl) {
      const fullPath = path.join(__dirname, "..", photo.imageUrl);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Foto eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar foto:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar la foto",
    });
  }
};