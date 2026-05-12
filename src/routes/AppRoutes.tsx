import { createBrowserRouter } from 'react-router-dom';
import { CartPage } from '../app/cart';
import { ProductList } from '../app/products';
import { AppLayout } from '../components/layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <ProductList /> },
      { path: 'cart', element: <CartPage /> }
    ]
  }
]);
