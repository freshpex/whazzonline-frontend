import { createBrowserRouter } from 'react-router-dom';
import { AdminProductPage } from '../app/admin';
import { LoginPage, SignupPage } from '../app/auth';
import { CartPage } from '../app/cart';
import { ProductDetails, ProductList } from '../app/products';
import { WishlistPage } from '../app/wishlist';
import { RequireAuth } from '../components/auth/RequireAuth';
import { AppLayout } from '../components/layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <ProductList /> },
      { path: 'products/:productId', element: <ProductDetails /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'cart', element: <CartPage /> },
          { path: 'wishlist', element: <WishlistPage /> }
        ]
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      {
        element: <RequireAuth allowedRoles={['admin', 'vendor']} />,
        children: [
          { path: 'admin/products/new', element: <AdminProductPage /> },
          { path: 'panel', element: <AdminProductPage /> }
        ]
      }
    ]
  }
]);
