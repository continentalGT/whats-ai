import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import DemoPage from './pages/DemoPage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import TrainPage from './pages/TrainPage'
import SubCategoryPage from './pages/SubCategoryPage'
import ShopPage from './pages/ShopPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected — require login */}
          <Route path="/category/:id" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
          <Route path="/category/:categoryId/:groupSlug" element={<ProtectedRoute><SubCategoryPage /></ProtectedRoute>} />
          <Route path="/demo/:categoryId/:demoSlug" element={<ProtectedRoute><DemoPage /></ProtectedRoute>} />
          <Route path="/train" element={<ProtectedRoute><TrainPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
