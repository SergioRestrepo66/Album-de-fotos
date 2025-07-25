import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componentes
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Layout from './components/ui/Layout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import AddPhoto from './components/photo/AddPhoto'; // Formulario para añadir foto
import PhotoForm from './components/photo/PhotoForm'; // Asegúrate de que la ruta es correcta
import PhotoCard from './components/photo/PhotoCard'; // Componente para mostrar las fotos
import PhotoGrid from './components/photo/PhotoGrid'; // Componente para mostrar la cuadrícula de fotos
import PhotoModal from './components/photo/PhotoModal'; // Componente para mostrar el modal de fotos

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Layout variant="simple">
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout variant="simple">
              <Register />
            </Layout>
          }
        />
        <Route
          path="/home"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/album"
          element={
            <Layout>
              <AddPhoto />
            </Layout>
          }
        />
        <Route
          path="/add-photo"
          element={
            <Layout>
              <AddPhoto />
            </Layout>
          }
        />
        <Route
          path="/photo-card"
          element={
            <Layout>
              <PhotoCard />
            </Layout>
          }
          />
          <Route
          path="/photo-form"
          element={
            <Layout>
              <PhotoForm />
            </Layout>
          }
        />
          <Route
          path="/photo-grid"
          element={
            <Layout>
              <PhotoGrid />
            </Layout>
          }
          />
          <Route
          path="/photo-modal"
          element={
            <Layout>
              <PhotoModal />
            </Layout>
          }
        />
      
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;