import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AgregarProducto from './pages/AgregarProducto'
import Index from './Index';
import Layout from './Layout';
import AgregarArea from './pages/AgregarArea';
import AgregarCompra from './pagesVendedor/AgregarCompra';
import ProductoLista from './pages/ProductosLista'
import ProductoDetalles from './pages/ProductoDetalles';
import VentaDetalles from './pages/VentaDetalles';
import VendedoresLista from './pages/VendedoresLista';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LayoutAuth from './LayoutAuth';
import LayoutVendedor from './LayoutVendedor'
import { useEffect, useState } from 'react';
import { estaAutenticado } from './api/productos.api'
import { AuthProvider } from './api/useAuth';
import PrivateRoute from './api/privateRoute'
import Historial from './pagesVendedor/Historial';
import VentaDetallesVendedor from './pagesVendedor/VentaDetallesVendedor'
import ProductosVendidos from './pagesVendedor/ProductosVendidos'
import UsuarioCuenta from './pages/UsuarioCuenta';


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
        {/* Admin */}
        <Route element={<PrivateRoute rolPermitido="administrador"><Layout autenticado={autenticado} /></PrivateRoute>}>
          <Route path="/panel" element={<PrivateRoute rolPermitido="administrador">
            <Index />
            </PrivateRoute>} />

          <Route path="/agregar-producto" element={<PrivateRoute rolPermitido="administrador">
            <AgregarProducto />
            </PrivateRoute>} />
          <Route path="/agregar-area" element={<PrivateRoute rolPermitido="administrador">
            <AgregarArea />
            </PrivateRoute>} />
          
          <Route path="/productos-lista" element={<PrivateRoute rolPermitido="administrador">
            <ProductoLista />
            </PrivateRoute>} />
          <Route path="/producto-detalles/:id/" element={<PrivateRoute rolPermitido="administrador">
            <ProductoDetalles />
            </PrivateRoute>} />
          <Route path="/ventas/:id/" element={<PrivateRoute rolPermitido="administrador">
            <VentaDetalles />
            </PrivateRoute>} />
          <Route path="/vendedores-lista/" element={<PrivateRoute rolPermitido="administrador">
            <VendedoresLista />
            </PrivateRoute>} />
          <Route path="/usuario-cuenta/" element={<PrivateRoute rolPermitido="administrador">
            <UsuarioCuenta />
            </PrivateRoute>} />
        </Route>

        {/* Vendedor */}
        <Route element={<PrivateRoute rolPermitido="vendedor"><LayoutVendedor autenticado={autenticado} /></PrivateRoute>}>
          <Route path="/historial" element={<PrivateRoute rolPermitido="vendedor">
            <Historial/>
            </PrivateRoute>}/>
          <Route path="/venta-detalles/:id/" element={<PrivateRoute rolPermitido="vendedor">
            <VentaDetallesVendedor/>
            </PrivateRoute>}/>
          <Route path="/agregar-compras" element={<PrivateRoute rolPermitido="vendedor">
            <AgregarCompra />
            </PrivateRoute>} />
          <Route path="/productos-vendidos" element={<PrivateRoute rolPermitido="vendedor">
            <ProductosVendidos />
            </PrivateRoute>} />
        </Route>

        {/* Auth */}
        <Route element={<LayoutAuth autenticado={autenticado} />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/registro/" element={<RegisterPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}