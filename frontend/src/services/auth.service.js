// Servicio de autenticación

// Simulación de registro de usuario (varios usuarios)
export function register({ name, email, password }) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.find(u => u.email === email)) {
    throw new Error('El usuario ya existe');
  }
  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
}

// Simulación de login de usuario
export function login({ email, password }) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Credenciales incorrectas');
  }
  // Puedes guardar el usuario actual en localStorage si lo deseas
  localStorage.setItem('userData', JSON.stringify(user));
  return user;
}

// Simulación de logout
export function logout() {
  localStorage.removeItem('userData');
}
