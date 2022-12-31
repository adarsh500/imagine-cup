import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import '@tensorflow/tfjs';

import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import VerifyEmail from './components/VerifyEmail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
]);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
