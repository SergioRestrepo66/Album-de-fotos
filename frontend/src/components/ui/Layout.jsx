import React from "react";
import Navbar from "./Navbar";

const SimpleNavbar = () => (
  <nav
    style={{
      background: "linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%)",
      padding: "1rem 0",
      textAlign: "center",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "1.5rem",
      letterSpacing: "1px",
    }}
  >
    Bienvenido a tu Álbum de fotos
  </nav>
);

// Este es el componente que incluye el navbar del Login y el Register
const Layout = ({ children, variant }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    {variant === "simple" ? <SimpleNavbar /> : <Navbar />}
    <main style={{ flex: 1 }}>{children}</main>
    <footer
      style={{
        background: "linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%)",
        color: "#fff",
        textAlign: "center",
        padding: "0.5rem 0",
        fontSize: "1.1rem",
        position: "fixed", // Fija el footer en la pantalla
        bottom: 0, // Lo coloca en la parte inferior
        left: 0, // Se extiende desde la izquierda
        width: "100%", // Ocupa todo el ancho
        zIndex: 1000, // Se mantiene por encima de otros elementos
      }}
    >
      <p style={{ margin: 0 }}>
        {" "}
        &copy; 2025 Todos los derechos Reservados. Creado By Sergio Restrepo
      </p>
    </footer>
  </div>
);

export default Layout;
