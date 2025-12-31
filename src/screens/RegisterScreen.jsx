import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseRegisterUrl } from "../services/urlParser";
import {
  validateRegisterData,
  checkIdExists,
} from "../services/registerService";
import MainScreen from "./MainScreen";
import zynLogoGrid from "../assets/zyn-logo-grid.png";
import miniPacketOpen from "../assets/mini-packet-open.png";
import formBackground from "../assets/form-background.png";

export default function RegisterScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener la URL completa incluyendo pathname y search (para GitHub Pages)
  // En GitHub Pages, los parámetros pueden estar en el pathname o en el query string
  const fullPath = location.pathname + (location.search || "");
  const [stage, setStage] = useState("animation"); // 'animation' | 'form' | 'error'
  const [registerData, setRegisterData] = useState(null);
  const [error, setError] = useState(null);
  const [validating, setValidating] = useState(false);
  // Ref para evitar ejecuciones múltiples del useEffect
  const hasValidatedRef = useRef(false);
  const currentPathRef = useRef(location.pathname);

  // Renderizar grid de logos para animación
  const renderLogoGrid = () => {
    const rows = 10;
    const cols = 3;
    const logos = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let baseOpacity = 0.3;
        if (
          (row === 1 && col === 1) ||
          (row === 7 && col === 0) ||
          (row === 9 && col === 2)
        ) {
          baseOpacity = 0.8;
        }

        const topPercent = row * 10.1;
        const width = 33.33;
        const leftPercent = col * width;

        logos.push(
          <div
            key={`logo-${row}-${col}`}
            className="absolute pointer-events-none"
            style={{
              top: `${topPercent}%`,
              left: `${leftPercent}%`,
              width: `${width}%`,
              height: "10.1%",
            }}
          >
            <div className="absolute inset-0" style={{ opacity: baseOpacity }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  alt=""
                  className="absolute left-0 max-w-none w-full h-full top-0 object-contain"
                  src={zynLogoGrid}
                />
              </div>
            </div>
          </div>
        );
      }
    }

    return logos;
  };

  useEffect(() => {
    // Resetear el flag si cambió la ruta
    if (currentPathRef.current !== location.pathname) {
      hasValidatedRef.current = false;
      currentPathRef.current = location.pathname;
      // Resetear estados al cambiar de ruta
      setStage("animation");
      setRegisterData(null);
      setError(null);
      setValidating(false);
    }

    // Evitar ejecuciones múltiples
    if (hasValidatedRef.current) {
      return;
    }

    const validateUrl = async () => {
      // Marcar como validado inmediatamente para evitar ejecuciones paralelas
      hasValidatedRef.current = true;

      try {
        // Limpiar el pathname para verificar si tiene parámetros
        // Remover el base path de GitHub Pages si existe
        const cleanPathname = location.pathname.replace(
          /^\/TAG-Register-score/,
          ""
        );

        // Si la URL es solo /registro/ sin parámetros, mostrar error
        if (
          cleanPathname === "/registro/" ||
          cleanPathname === "/registro" ||
          location.pathname === "/TAG-Register-score/registro/" ||
          location.pathname === "/TAG-Register-score/registro"
        ) {
          setError(
            "Ruta inválida. Se requiere una URL de registro válida con parámetros."
          );
          setStage("error");
          return;
        }

        // Parsear la URL usando el pathname completo
        // El script en index.html ya convirtió ~and~ de vuelta a & si venía del 404.html
        const parsed = parseRegisterUrl(location.pathname);

        if (parsed.error) {
          setError(parsed.error);
          setStage("error");
          return;
        }

        // Validar con Cloud Function durante la animación
        setValidating(true);
        const validation = await validateRegisterData(parsed.data);

        if (!validation.success) {
          setError(
            validation.error || "Los datos proporcionados no son válidos"
          );
          setStage("error");
          setValidating(false);
          return;
        }

        // Verificar si el ID existe y si ya tiene datos completos
        const idCheck = await checkIdExists(parsed.data.id);
        if (!idCheck.exists) {
          setError("ID no encontrado. Este token no es válido.");
          setStage("error");
          setValidating(false);
          return;
        }

        if (idCheck.hasData) {
          setError(
            "Este registro ya ha sido utilizado. El ID ya tiene datos completos."
          );
          setStage("error");
          setValidating(false);
          return;
        }

        // Si todo está bien, guardar los datos
        setRegisterData(parsed.data);
        setValidating(false);

        // La animación se completará después de 3 segundos y mostrará el formulario
      } catch (err) {
        console.error("Error al validar URL:", err);
        setError("Error al procesar la solicitud. Por favor, verifica la URL.");
        setStage("error");
        setValidating(false);
        // Permitir reintento en caso de error
        hasValidatedRef.current = false;
      }
    };

    validateUrl();
  }, [location.pathname]);

  // Animación inicial por 3 segundos (solo si hay parámetros y validación exitosa)
  useEffect(() => {
    if (stage === "animation" && registerData && !validating && !error) {
      const timer = setTimeout(() => {
        setStage("form");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage, registerData, validating, error]);

  // Si hay error, mostrar página de error inmediatamente
  if (stage === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001175] to-[#0033cc] relative overflow-hidden">
        {/* Background */}
        <img
          src={formBackground}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />

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
              Error de Validación
            </h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#001175] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0033cc] transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay parámetros o ya pasó la animación, mostrar MainScreen
  if (stage === "form") {
    return <MainScreen registerData={registerData} />;
  }

  // Pantalla de animación inicial (solo si hay parámetros)
  return (
    <div className="bg-[#00a9df] relative w-full h-screen overflow-hidden">
      {renderLogoGrid()}
      <div className="absolute inset-[27.38%_7.48%_27.38%_7.5%] md:inset-[27.38%_7.48%_27.38%_7.5%] animate-fadeIn">
        <div className="absolute inset-0">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              alt=""
              className="absolute left-0 max-w-none w-full h-full top-0 object-contain"
              src={miniPacketOpen}
            />
          </div>
        </div>
      </div>
      {validating && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold">
          Validando URL...
        </div>
      )}
    </div>
  );
}
