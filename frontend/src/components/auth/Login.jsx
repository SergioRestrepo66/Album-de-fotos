import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaLock } from 'react-icons/fa';

// Componente de login
const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  // Al montar, siempre empezar con campos vacíos y checkbox desmarcado
  useEffect(() => {
    setEmail('');
    setPassword('');
    setRemember(false);
    // Si se viene de cerrar sesión, NO limpiar datos recordados
    // Los datos se mantienen para poder recordarlos después
  }, [location.state]);

  // Manejar el checkbox de recordar
  const handleRememberChange = (e) => {
    const checked = e.target.checked;
    setRemember(checked);
    
    if (checked) {
      // Si hay datos en los campos, guardar los datos actuales
      if (email && password) {
        localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
      } else {
        // Si no hay datos en los campos, recuperar datos guardados de la última sesión
        const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
        if (rememberedUser) {
          setEmail(rememberedUser.email);
          setPassword(rememberedUser.password);
        }
      }
    } else {
      // Al desmarcar, limpiar campos pero mantener datos guardados
      setEmail('');
      setPassword('');
    }
  };

  // Guardar usuario recordado cuando cambien email/password y remember esté activo
  useEffect(() => {
    if (remember && email && password) {
      localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
    }
  }, [email, password, remember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Buscar usuario en el array de usuarios
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      setError('Usuario no registrado o credenciales incorrectas');
      return;
    }
    // Al hacer login exitoso, SIEMPRE guardar los datos de la cuenta actual
    // Esto sobrescribe cualquier dato anterior
    localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
    // Login exitoso, redirige a home
    navigate('/home');
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow" style={{ minWidth: 350, borderRadius: '1rem', border: '1px solid #ccc' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
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
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="remember"
                checked={remember}
                onChange={handleRememberChange}
                style={{
                  border: '2px solid rgb(7, 71, 122)', 
                }}
              />
              <label className="form-check-label" htmlFor="remember">
                Recordar Email y Password
              </label>
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
                Entrar
              </button>
            </div>
          </form>
          <p className="mt-3 text-center">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;



