import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/common/layout';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';
import Products from './components/products';
import ProductDetail from './components/productDetail';
import Cart from './components/cart';
import Admin from './components/admin';
import AdminRoute from './components/adminRoute';
import GuestRoute from './components/guestRoute';
import RequireAuth from './components/requireAuth';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<Home />}></Route>
              <Route path='/products' element={<Products />}></Route>
              <Route path='/products/:category' element={<Products />}></Route>
              <Route path='/product/:id' element={<ProductDetail />}></Route>
              <Route path='/cart' element={<RequireAuth><Cart /></RequireAuth>}></Route>
            </Route>
            <Route path='/login' element={<GuestRoute><Login /></GuestRoute>}></Route>
            <Route path='/signup' element={<GuestRoute><Signup /></GuestRoute>}></Route>
            <Route path='/admin' element={<AdminRoute><Admin /></AdminRoute>}></Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
