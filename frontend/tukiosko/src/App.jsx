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


export default function App() {
  return (
    <BrowserRouter>
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
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/agregar-compra" element={<AgregarCompra />} />
          <Route path="/agregar-producto" element={<AgregarProducto />} />
          <Route path="/agregar-area" element={<AgregarArea />} />
          <Route path="/agregar-vendedor" element={<AgregarVendedor />} />
          <Route path="/productos-lista" element={<ProductoLista />} />
          <Route path="/producto-detalles/:id/" element={<ProductoDetalles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}