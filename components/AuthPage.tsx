import React, { useState } from 'react';
import { supabase } from '../supabase';

const AVATAR_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        if (!name) throw new Error('O nome é obrigatório para cadastro.');
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (data.user) {
          const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
          const { error: profileError } = await supabase.from('users').insert({
            id: data.user.id,
            name,
            avatar_color: color,
            role: 'performer'
          });
          if (profileError) throw profileError;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro durante a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-dark-card">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-primary">
            {isLoginView ? 'Bem-vindo!' : 'Crie sua Conta'}
          </h2>
          <p className="mt-1 text-center text-gray-600 dark:text-gray-400">
            {isLoginView ? 'Faça login para continuar' : 'Preencha para se cadastrar'}
          </p>

          <form onSubmit={handleAuth} className="mt-6">
            {!isLoginView && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="name">
                  Nome (Apelido)
                </label>
                <input
                  id="name"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary focus:ring-primary focus:outline-none focus:ring focus:ring-opacity-40"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLoginView}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary focus:ring-primary focus:outline-none focus:ring focus:ring-opacity-40"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary focus:ring-primary focus:outline-none focus:ring focus:ring-opacity-40"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

            <div className="mt-6">
              <button disabled={loading} className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:bg-primary/90 disabled:opacity-50">
                {loading ? 'Carregando...' : (isLoginView ? 'Entrar' : 'Cadastrar')}
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
            {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button onClick={toggleView} type="button" className="ml-1 font-medium text-primary hover:underline">
              {isLoginView ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
