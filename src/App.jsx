import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './screens/Dashboard'
import RegisterScreen from './screens/RegisterScreen'
import RegisterSuccess from './screens/RegisterSuccess'

// Componente para rutas no encontradas
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001175] to-[#0033cc] relative overflow-hidden">
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#001175] mb-4">
            Ruta No Encontrada
          </h2>
          <p className="text-gray-700 mb-6">
            La ruta que intentas acceder no existe. Se requiere una URL de registro válida.
          </p>
        </div>
      </div>
    </div>
  )
}

function App() {
  // Base path para GitHub Pages (Vite lo inyecta automáticamente desde vite.config.js)
  const basename = import.meta.env.BASE_URL;
  
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<Navigate to="/registro/" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro/*" element={<RegisterScreen />} />
        <Route path="/registro-exitoso" element={<RegisterSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

// Script para manejar la redirección de GitHub Pages 404
// Este script se ejecuta antes de que React cargue
if (typeof window !== 'undefined') {
  const pathname = window.location.pathname;
  const search = window.location.search;
  
  // Si la URL tiene el formato de GitHub Pages 404 redirect (/?/...)
  if (pathname.includes('/?/')) {
    const basePath = '/TAG-Register-score';
    const redirectPath = pathname.replace('/?/', '/').replace(/~and~/g, '&');
    
    // Reconstruir la URL correctamente
    const newPath = basePath + redirectPath + search + window.location.hash;
    window.history.replaceState({}, '', newPath);
  }
}

export default App
