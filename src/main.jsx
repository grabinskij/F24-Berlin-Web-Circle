import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import ErrorPage from './error-page'
import './index.css'
import ProductPage from './pages/ProductPage.jsx'
import Root from './pages/RootLayout/Root.jsx'
import FilteredPlacesPage from './pages/FilteredPlacesPage/FilteredPlacesPage.jsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n.js'
import { AuthProvider } from './context/AuthContext'
import BookingsPage from './pages/BookingsPage/BookingsPage.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: 'rooms/:productId',
        element: <ProductPage />,
      },
      {
        path: 's/:region/homes',
        element: <FilteredPlacesPage />,
      },
      {
        path: '/bookings',
        element: (
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </I18nextProvider>
  </StrictMode>
)
