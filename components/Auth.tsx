import React, { useState } from 'react';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signInEmailPassword, isLoading: isSigningIn, isError: isSignInError, error: signInError } = useSignInEmailPassword();
  const { signUpEmailPassword, isLoading: isSigningUp, isError: isSignUpError, error: signUpError } = useSignUpEmailPassword();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignUp) {
      await signUpEmailPassword(email, password);
    } else {
      console.log('Signing in with:', { email, password });
      await signInEmailPassword(email, password);
    }
  };

  const isLoading = isSigningIn || isSigningUp;
  const isError = isSignInError || isSignUpError;
  const error = signInError || signUpError;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-2xl transform transition duration-500 hover:scale-105">
        <div>
          <h2 className="text-4xl font-extrabold text-center text-white">
            {isSignUp ? 'Create an Account' : 'Sign In to Your Account'}
          </h2>
          <p className="mt-2 text-sm text-center text-gray-400">
            {isSignUp ? 'Join us and start your journey!' : 'Welcome back! Please sign in.'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="space-y-4">
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {isError && (
            <p className="text-sm text-red-400 text-center animate-pulse">{error?.message}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-lg group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transform transition duration-300 hover:scale-105"
            >
              {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-indigo-400 hover:text-indigo-300 transform transition duration-300 hover:scale-105">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
