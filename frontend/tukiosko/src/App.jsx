import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AgregarProducto from './pages/AgregarProducto'
import Index from './Index';
import Layout from './Layout';
import AgregarArea from './pages/AgregarArea';
import AgregarVendedor from './pages/AgregarVendedor';
import AgregarCompra from './pages/AgregarCompra';
import ProductoLista from './pages/ProductosLista'
import ProductoDetalles from './pages/ProductoDetalles';
import VentaDetalles from './pages/VentaDetalles';
import VendedoresLista from './pages/VendedoresLista';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LayoutAuth from './LayoutAuth';
import { useEffect, useState } from 'react';
import { estaAutenticado } from './api/productos.api'
import { AuthProvider } from './api/useAuth';
import PrivateRoute from './api/privateRoute'


export default function App() {
  const [autenticado, setAutenticado] = useState(null);

  console.log('esta auntenicado?')
  useEffect(()=>{
    estaAutenticado()
    .then(response => {
      setAutenticado(response.data.autenticado);
      console.log(`app ----${response.data.rol}`)
    })
    .catch(error => {
      console.error('Error al obtener autenticacion:', error);
    });
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
      <Toaster position="top-right"
      theme='light'
        toastOptions={{
          style: {
            background: '#1c2d47',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.1)'
          },
          className: 'my-custom-toast',
        }} />
      <Routes>
        <Route element={<Layout autenticado={autenticado} setAutenticado={setAutenticado} />}>
          <Route path="/panel" element={<PrivateRoute><Index /></PrivateRoute>} />
          <Route path="/agregar-compra" element={<PrivateRoute><AgregarCompra /></PrivateRoute>} />
          <Route path="/agregar-producto" element={<PrivateRoute><AgregarProducto /></PrivateRoute>} />
          <Route path="/agregar-area" element={<PrivateRoute><AgregarArea /></PrivateRoute>} />
          <Route path="/agregar-vendedor" element={<PrivateRoute><AgregarVendedor /></PrivateRoute>} />
          <Route path="/productos-lista" element={<PrivateRoute><ProductoLista /></PrivateRoute>} />
          <Route path="/producto-detalles/:id/" element={<PrivateRoute><ProductoDetalles /></PrivateRoute>} />
          <Route path="/ventas/:id/" element={<PrivateRoute><VentaDetalles /></PrivateRoute>} />
          <Route path="/vendedores-lista/" element={<PrivateRoute><VendedoresLista /></PrivateRoute>} />
        </Route>

        {/* Auth */}
        <Route element={<LayoutAuth autenticado={autenticado} />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/registro/" element={<RegisterPage />} />
        </Route>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}