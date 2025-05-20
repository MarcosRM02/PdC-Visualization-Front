import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  // Intenta recuperar sesión activa
  useEffect(() => {
    axios
      .get<number>('experiments/by-token/token') // → ruta relativa
      .then(({ data: professionalId }) => {
        if (professionalId) {
          navigate(`experiments/by-professional/${professionalId}`, {
            replace: true,
          });
        }
      })
      .catch(() => {
        // 401 / 403 → sin sesión, no hacemos nada
      });
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await axios.post<{
        id: number;
        name: string;
      }>('authentication/login', { email, password });
      localStorage.setItem('professionalId', data.id.toString());
      // data.id es el ID del profesional
      navigate(`experiments/by-professional/${data.id}`, {
        replace: true,
      });
    } catch (err: any) {
      if (err.response) {
        setErrorMessage(err.response.data.message || 'Credenciales inválidas');
      } else {
        setErrorMessage('Ha ocurrido un error. Inténtalo más tarde.');
      }
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 1) Área central con el form */}
      <div className="flex-1 flex items-center justify-center">
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
            {errorMessage && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">
                  {errorMessage}
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

      <footer className="h-12 bg-gray-800 flex items-center justify-center">
        <div className="text-gray-300 text-sm">
          &copy; {new Date().getFullYear()}
          <a
            href="https://mamilab.eu/"
            className="underline hover:text-white ml-2"
          >
            MAmI Reasearch Lab{' '}
          </a>
          <a
            href="/cookie-policy"
            className="underline hover:text-white ml-2"
            onClick={(e) => {
              e.preventDefault();
              // push a history en lugar de replace:
              navigate('/cookie-policy', {
                state: { from: location.pathname },
              });
            }}
          >
            Cookie Policy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
