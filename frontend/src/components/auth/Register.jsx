import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaLock } from 'react-icons/fa';

// Componente de registro
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Recuperar usuarios existentes
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Validar que el email no esté repetido
    if (users.some(user => user.email === email)) {
      setError('El email ya está registrado. Usa otro.');
      return;
    }
    // Guardar nuevo usuario
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuario registrado correctamente');
    // Después de registrar el usuario y antes de navegar, guarda el email en localStorage
    localStorage.setItem('currentUserEmail', email);
    navigate('/login');
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow" style={{ minWidth: 350, borderRadius: '1rem', border: '1px solid #ccc' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Registro</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Nombre:</label>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{
                    border: '2px solid #2196f3',
                    borderRadius: '0.7rem',
                    boxShadow: '0 0 8px #90caf9',
                    paddingRight: '36px',
                    width: '100%'
                  }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <FaUser style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2196f3' }} />
              </div>
            </div>
            <div className="mb-3">
              <label>Email:</label>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <input
                  type="email"
                  className="form-control"
                  style={{
                    border: '2px solid #2196f3',
                    borderRadius: '0.7rem',
                    boxShadow: '0 0 8px #90caf9',
                    paddingRight: '36px',
                    width: '100%'
                  }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <FaUser style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2196f3' }} />
              </div>
            </div>
            <div className="mb-3">
              <label>Password:</label>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <input
                  type="password"
                  className="form-control"
                  style={{
                    border: '2px solid #2196f3',
                    borderRadius: '0.7rem',
                    boxShadow: '0 0 8px #90caf9',
                    paddingRight: '36px',
                    width: '100%'
                  }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <FaLock style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2196f3' }} />
              </div>
            </div>
            {error && <div className="text-danger mb-2">{error}</div>}
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn"
                style={{
                  background: '#1976d2',
                  color: '#fff',
                  borderRadius: '2rem',
                  fontWeight: 'bold',
                  minWidth: 150
                }}
              >
                Registrarse
              </button>
            </div>
          </form>
          <p className="mt-3 text-center">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;