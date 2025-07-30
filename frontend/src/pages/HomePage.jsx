import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      {/* ===== LÓGICA DEL COMPONENTE ===== */}

      {/* Sección de Bienvenida */}
      <div
        className="d-flex justify-content-center align-items-center welcome-container"
        style={{ minHeight: "80vh", paddingTop: "120px" }}
      >
        <div
          className="border border-primary border-2 rounded-3 shadow-lg mx-auto text-center bg-primary bg-opacity-25 welcome-card"
          style={{
            maxWidth: 600,
            borderColor: "#2196f3 !important",
            boxShadow: "0 0 16px #90caf9 !important",
          }}
        >
          <h2 className="mb-3 welcome-title">
            ¡Bienvenido a tu Álbum de Fotos!
          </h2>
          <p className="mb-0 welcome-text">
            ¿Cuándo visitas un lugar y tomas fotos te gustaría que estuvieran
            guardadas en un lugar especial como un álbum? ¡Pues aquí esta el
            álbum de fotos digital, en donde puedes guardar todas las fotos
            importantes de tus viajes a distintos países o regiones del mundo, o
            inclusive lo puedes dejar para guardar fotos familiares!. ¡Ya tu
            decides para que lo quieres utilizar!. Y no te preocupes por que no
            se te van a perder, cuando las guardas se quedan aquí para siempre.
            ¡Esperamos que guardes muchas fotos!. Para empezar solamente dale a{" "}
            <Link
              to="/album"
              className="text-decoration-underline fw-bold"
              style={{ color: "#1976d2" }}
            >
              Álbum
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Sección de Tutorial */}
      <div className="tutorial-container">
        <div className="text-center mb-4">
          <h3
            className="fw-bold"
            style={{ color: "#1976d2", fontSize: "1.8rem" }}
          >
            ¿Cómo usar tu Álbum de Fotos?
          </h3>
          <p className="text-muted">Sigue estos pasos simples para empezar</p>
        </div>

        <div className="tutorial-grid">
          {/* Paso 1 */}
          <div className="tutorial-card position-relative">
            <div className="tutorial-number">1</div>
            <div className="tutorial-icon">📸</div>
            <h4
              className="tutorial-title fw-bold mb-3"
              style={{ color: "#1976d2" }}
            >
              Sube tus Fotos
            </h4>
            <p className="tutorial-text text-muted">
              Ve a la pestaña "Álbum" y haz clic en el botón azul "+" Añadir Foto. Completa
              el formulario con los datos de tu foto y presiona "Crear foto".
              ¡Listo! Ya tienes tu foto creada.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="tutorial-card position-relative">
            <div className="tutorial-number">2</div>
            <div className="tutorial-icon">✏️</div>
            <h4
              className="tutorial-title fw-bold mb-3"
              style={{ color: "#1976d2" }}
            >
              Añade Información
            </h4>
            <p className="tutorial-text text-muted">
              Completa el formulario con el título, fecha y descripción de tu
              foto y por supuesto sube tu foto. luego dale al boton "Crear Foto"
              ¡Listo!. Ya tienes tu primera foto creada.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="tutorial-card position-relative">
            <div className="tutorial-number">3</div>
            <div className="tutorial-icon">👁️</div>
            <h4
              className="tutorial-title fw-bold mb-3"
              style={{ color: "#1976d2" }}
            >
              Visualiza y Edita tus Fotos
            </h4>
            <p className="tutorial-text text-muted">
              Haz clic en cualquier foto de deplegará un modal, en el, puedes
              actualizar la información de la imagen, traer las imagenes que has
              creado o eliminar la imagen si lo deseas.
            </p>
          </div>

          {/* Paso 4 */}
          <div className="tutorial-card position-relative">
            <div className="tutorial-number">4</div>
            <div className="tutorial-icon">💾</div>
            <h4
              className="tutorial-title fw-bold mb-3"
              style={{ color: "#1976d2" }}
            >
              Guardado Automático
            </h4>
            <p className="tutorial-text text-muted">
              No te preocupes por perder tus fotos. Se guardan automáticamente
              en tu navegador y permanecen ahí para siempre, incluso si cierras
              la página.
            </p>
          </div>

          {/* Paso 5 */}
          <div className="tutorial-card position-relative">
            <div className="tutorial-number">5</div>
            <div className="tutorial-icon">🌍</div>
            <h4
              className="tutorial-title fw-bold mb-3"
              style={{ color: "#1976d2" }}
            >
              Eliminación de Fotos
            </h4>
            <p className="tutorial-text text-muted">
              Si no te gustó el resultado de tu fotografia la puedes eliminar
              facilmente, ya que el modal que se despliega está la función de
              eliminar foto.
            </p>
          </div>

          {/* Paso 6 */}
          <div className="tutorial-card position-relative">
            <div className="tutorial-number">6</div>
            <div className="tutorial-icon">🎉</div>
            <h4
              className="tutorial-title fw-bold mb-3"
              style={{ color: "#1976d2" }}
            >
              ¡Disfruta tus Recuerdos!
            </h4>
            <p className="tutorial-text text-muted">
              Ahora tienes un álbum digital personal que puedes usar para fotos
              de viajes, familiares o cualquier momento especial que quieras
              conservar.
            </p>
          </div>
        </div>
      </div>

      {/* ===== ESTILOS CSS ===== */}
      <style>{`
        /* Móvil (hasta 767px) */
        @media (max-width: 767.98px) {
          .welcome-container {
            padding: 0 15px !important;
            margin-top: -70px !important;
          }
          .welcome-card {
            max-width: 100% !important;
            margin: 15px !important;
            padding: 1.5rem !important;
          }
          .welcome-title {
            font-size: 1.35rem !important;
            line-height: 1.3 !important;
          }
          .welcome-text {
            font-size: 0.9rem !important;
            line-height: 1.4 !important;
          }
          .tutorial-container {
            padding: 0 15px !important;
            padding-bottom: 6rem !important;
            margin-top: -120px !important;
          }
          .tutorial-card {
            margin-bottom: 1.5rem !important;
            padding: 1.5rem !important;
          }
          .tutorial-title {
            font-size: 1.2rem !important;
          }
          .tutorial-text {
            font-size: 0.9rem !important;
          }
        }

        /* Tablet (768px - 991px) */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .welcome-container {
            padding: 0 20px !important;
          }
          .welcome-card {
            max-width: 90% !important;
            margin: 20px auto !important;
            padding: 1.75rem !important;
            margin-top: -450px !important;
          }
          .welcome-title {
            font-size: 1.6rem !important;
            line-height: 1.3 !important;
          }
          .welcome-text {
            font-size: 0.95rem !important;
            line-height: 1.5 !important;
          }
          .tutorial-container {
            padding: 0 20px !important;
            padding-bottom: 6rem !important;
            margin-top: -450px !important;
          }
          .tutorial-card {
            margin-bottom: 2rem !important;
            padding: 2rem !important;
          }
        }

        /* PC/Desktop (992px en adelante) - Mantiene estilos originales */
        @media (min-width: 992px) {
          .welcome-card {
            max-width: 600px !important;
            padding: 2rem !important;
            margin-top: -150px
          }
          .welcome-title {
            font-size: 2rem !important;
          }
          .welcome-text {
            font-size: 1rem !important;
          }
          .tutorial-container {
            max-width: 1200px !important;
            margin: -90px auto 0rem auto !important;
            padding: 0 20px !important;
            padding-bottom: 6rem !important;
          }
          .tutorial-card {
            margin-bottom: 2rem !important;
            padding: 2rem !important;
          }
        }

        /* Estilos generales del tutorial */
        .tutorial-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .tutorial-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          border: 1px solid #e8e8e8;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .tutorial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .tutorial-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #4fc3f7 0%, #1976d2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          color: white;
          font-size: 1.5rem;
        }

        .tutorial-number {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ff6b6b;
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }
      `}</style>
    </>
  );
};

export default HomePage;
