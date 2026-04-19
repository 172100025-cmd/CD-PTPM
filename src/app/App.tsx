import { RouterProvider } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import { MenuProvider } from './contexts/MenuContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';

export default function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <OrderProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </OrderProvider>
      </CartProvider>
    </MenuProvider>
  );
}
