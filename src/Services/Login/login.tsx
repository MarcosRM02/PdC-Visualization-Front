import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(process.env.REACT_APP_URL); // Debe mostrar la URL
    console.log(`la url es: ${process.env.REACT_APP_URL}/authentication/login`); // Debe mostrar la URL completa
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log('url2: ', apiUrl); // Debe mostrar la URL
    console.log(import.meta.env.VITE_API_URL); // Debe mostrar la URL

    try {
      const response = await fetch(`${apiUrl}/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('Login response:', response);
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('accessToken', data.accessToken); // Guardar el token en sessionStorage
        sessionStorage.setItem('expiresIn', data.expiresIn); // Opcional, guardar la expiración
        setWelcomeMessage('Welcome! Loading your user profile...');
        setTimeout(() => {
          setWelcomeMessage('');
          navigate(`/experiments/by-professional/${data.id}`, {
            replace: true,
          });
        }, 1000); // Comentar esto si no quiero que tarde
      } else {
        const errorData = await response.json();
        setWelcomeMessage(errorData.message); // Usa el mensaje del servidor
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
          <input type="hidden" name="remember" defaultValue="true" />
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

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
