import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const navigate = useNavigate();

  // Efecto para verificar la existencia de un token y validar su vigencia
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const expiresIn = localStorage.getItem('expiresIn');

    if (token && expiresIn && new Date().getTime() < parseInt(expiresIn)) {
      const apiUrl = import.meta.env.VITE_API_URL;

      // Verificar el token con el servidor
      fetch(`${apiUrl}/experiments/by-token/token`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data) {
            // Redirigir al usuario a la ruta deseada con el id del profesional
            navigate(`/experiments/by-professional/${data}`, {
              replace: true,
            });
          } else {
            console.log('No se encontró el id del profesional');
          }
        })
        .catch((error) => {
          console.error('Error al verificar el token:', error);
          // Opcional: manejar errores y redirigir al login si es necesario
        });
    } else {
      console.log('No hay token o ha expirado');
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        const expiration = new Date().getTime() + data.expiresIn * 1000;
        localStorage.setItem('expiresIn', expiration.toString());
        navigate(`/experiments/by-professional/${data.id}`, {
          replace: true,
        });
      } else {
        const errorData = await response.json();
        setWelcomeMessage(errorData.message);
        setTimeout(() => {
          setWelcomeMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setWelcomeMessage('An error occurred. Please try again later.');
      setTimeout(() => {
        setWelcomeMessage('');
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 max-w-md w-full space-y-8 bg-white shadow-2xl rounded-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {welcomeMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">
                {welcomeMessage}
              </p>
            </div>
          )}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
