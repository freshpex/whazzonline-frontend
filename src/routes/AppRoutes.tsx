import { createBrowserRouter } from 'react-router-dom';
import { CartPage } from '../app/cart';
import { ProductDetails, ProductList } from '../app/products';
import { AppLayout } from '../components/layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <ProductList /> },
      { path: 'products/:productId', element: <ProductDetails /> },
      { path: 'cart', element: <CartPage /> }
    ]
  }
]);
