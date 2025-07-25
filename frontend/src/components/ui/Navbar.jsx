import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        background: 'linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%)',
        padding: '1rem 0',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1050,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      <style>
        {`
          .nav-container {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
          }
          .nav-link-animated {
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.2rem;
            letter-spacing: 1px;
            position: relative;
            transition: color 0.2s;
          }
          .nav-link-animated::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -2px;
            width: 0;
            height: 2px;
            background: #0d2346;
            transition: width 0.3s cubic-bezier(.4,0,.2,1), left 0.3s cubic-bezier(.4,0,.2,1);
          }
          .nav-link-animated:hover {
            color: #0d2346;
          }
          .nav-link-animated:hover::after {
            width: 100%;
            left: 0;
          }
          .logout-btn {
            background: #fff;
            color: #1976d2;
            border: none;
            border-radius: 20px;
            padding: 0.5rem 1.2rem;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            transition: all 0.2s;
          }
          .logout-btn:hover {
            color: rgb(5, 19, 41);
            transform: translateY(-1px);
          }

          /* Estilos para tablet */
          @media (max-width: 992px) {
            .nav-container {
              justify-content: space-between;
              padding: 0 30px;
            }
            .nav-links {
              gap: 1.5rem;
            }
            .logout-btn {
              position: static;
              transform: none;
            }
          }

          /* Estilos para móvil */
          @media (max-width: 768px) {
            nav {
              padding: 0.9rem 0;
            }
            .nav-container {
              padding: 0 -40px;
            }
            .nav-link-animated {
              font-size: 1rem;
            }
            .nav-links {
              gap: 1rem;
            }
            .logout-btn {
              padding: 0.4rem 1rem;
              font-size: 0.9rem;
            }
          }

          /* Estilos para móviles pequeños */
          @media (max-width: 480px) {
            .nav-link-animated {
              font-size: 0.9rem;
            }
            .logout-btn {
              padding: 0.3rem 0.8rem;
              font-size: 0.8rem;
            }
          }
        `}
      </style>

      <div className="nav-container">
        <div className="nav-links">
          <Link to="/home" className="nav-link-animated">
            Inicio
          </Link>
          <Link to="/album" className="nav-link-animated">
            Álbum
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="logout-btn"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;