import { useState, useEffect } from "react";
import {
  signInWithGoogle,
  onAuthChange,
  saveUserScore,
} from "../services/authService";
import { saveRegisterData } from "../services/registerService";
import {
  getAvatarPath,
  getFraternityColor,
  getFraternityFrame,
} from "../utils/avatarUtils";
import marcoGenerico from "../assets/Marco.png";

// Images - Local assets
import zynLogoGrid from "../assets/zyn-logo-grid.png";
import miniPacketOpen from "../assets/mini-packet-open.png";
import formBackground from "../assets/form-background.png";
import zynLogoForm from "../assets/zyn-logo-form.png";
import zynLogoConfirmation from "../assets/zyn-logo-confirmation.png";

// Estados: 'animation' | 'form' | 'confirmation'
export default function MainScreen({ registerData = null }) {
  // Si hay registerData, saltar animación y mostrar formulario directamente
  const [stage, setStage] = useState(registerData ? "form" : "animation");
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Observar cambios en autenticación
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        // Si el usuario se autentica con Google, llenar el formulario automáticamente
        if (user.displayName && user.email) {
          setFormData({
            nombre: user.displayName,
            email: user.email,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Animación inicial por 3 segundos (solo si no hay registerData)
  useEffect(() => {
    if (stage === "animation" && !registerData) {
      const timer = setTimeout(() => {
        setStage("form");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage, registerData]);

  // Activar confeti por 3 segundos cuando se entra a la pantalla de confirmación
  useEffect(() => {
    if (stage === "confirmation") {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [stage]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.nombre && formData.email) {
      setLoading(true);
      try {
        let result;

        // Si hay registerData (viene de URL), usar saveRegisterData
        if (registerData) {
          result = await saveRegisterData(registerData, {
            nombre: formData.nombre,
            email: formData.email,
          });
        } else {
          // Si no hay registerData, usar saveUserScore (comportamiento original)
          const horaInicio = new Date().toISOString();
          result = await saveUserScore({
            nombre: formData.nombre,
            email: formData.email,
            horaInicio: horaInicio,
          });
        }

        if (result.success) {
          setStage("confirmation");
        } else {
          alert("Error al guardar: " + result.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al procesar el registro");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        // El formulario se llenará automáticamente por el useEffect de onAuthChange
        // Guardar datos en Firestore y avanzar a confirmación
        let scoreResult;

        // Si hay registerData (viene de URL), usar saveRegisterData
        if (registerData) {
          scoreResult = await saveRegisterData(registerData, {
            nombre: result.user.displayName,
            email: result.user.email,
          });
        } else {
          // Si no hay registerData, usar saveUserScore (comportamiento original)
          const horaInicio = new Date().toISOString();
          scoreResult = await saveUserScore({
            nombre: result.user.displayName,
            email: result.user.email,
            horaInicio: horaInicio,
          });
        }

        if (scoreResult.success) {
          setStage("confirmation");
        } else {
          // Aún así avanzar a confirmación si hay error al guardar
          console.error("Error al guardar score:", scoreResult.error);
          setStage("confirmation");
        }
      } else {
        alert("Error al iniciar sesión: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  // Renderizar grid de logos animado
  const renderLogoGrid = () => {
    const rows = 10;
    const cols = 3;
    const logos = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let opacity = 0.15;
        if (
          (row === 1 && col === 1) ||
          (row === 7 && col === 0) ||
          (row === 9 && col === 2)
        ) {
          opacity = 0.4;
        }

        const topPercent = row * 10.1;
        const width = 33.33;
        const leftPercent = col * width;

        logos.push(
          <div
            key={`${row}-${col}`}
            className="absolute animate-fadeIn"
            style={{
              top: `${topPercent}%`,
              left: `${leftPercent}%`,
              width: `${width}%`,
              height: "10.1%",
              animationDelay: `${(row * cols + col) * 0.05}s`,
            }}
          >
            <div className="absolute inset-0" style={{ opacity }}>
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

  // Renderizar serpentinas/confeti que caen desde arriba
  const renderConfetti = () => {
    const confettiPieces = [];
    const colors = [
      "#FF3B3B",
      "#FF8C00",
      "#FFD700",
      "#7CFC00",
      "#00FF7F",
      "#00CED1",
      "#00BFFF",
      "#1E90FF",
      "#4169E1",
      "#8A2BE2",
      "#FF00FF",
      "#FF1493",
    ];

    // Crear 80 piezas de confeti/serpentinas
    for (let i = 0; i < 80; i++) {
      const left = Math.random() * 100; // Posición horizontal aleatoria
      // Distribuir los delays uniformemente durante los 3 segundos
      const delay = (i / 80) * 2.5; // Delay distribuido de 0 a 2.5 segundos
      const duration = 1.5 + Math.random() * 1; // Duración entre 1.5-2.5 segundos
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Crear diferentes tipos de piezas: serpentinas largas y confeti pequeño
      const isStreamer = Math.random() > 0.4; // 60% serpentinas, 40% confeti

      let width, height, borderRadius;
      if (isStreamer) {
        // Serpentinas: largas y delgadas
        width = 4 + Math.random() * 3; // 4-7px de ancho
        height = 60 + Math.random() * 80; // 60-140px de largo
        borderRadius = "2px";
      } else {
        // Confeti: pequeños cuadrados/círculos
        const size = 6 + Math.random() * 8; // 6-14px
        width = size;
        height = size;
        borderRadius = Math.random() > 0.5 ? "50%" : "2px"; // Algunos círculos, algunos cuadrados
      }

      const initialRotation = Math.random() * 360;
      const drift = (Math.random() - 0.5) * 80; // Deriva horizontal aleatoria (-40px a +40px)

      confettiPieces.push(
        <div
          key={`confetti-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `calc(${left}% + ${drift}px)`,
            top: "-100px",
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: color,
            borderRadius: borderRadius,
            animation: `fall ${duration}s linear ${delay}s forwards`,
            transform: `rotate(${initialRotation}deg)`,
            zIndex: 1000,
            boxShadow: `0 0 ${width}px ${color}`,
          }}
        />
      );
    }

    return confettiPieces;
  };

  // Renderizar grid de logos como marca de agua (mismo que animación inicial pero con opacity reducida)
  const renderWatermarkGrid = () => {
    const rows = 10;
    const cols = 3;
    const logos = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let baseOpacity = 0.15;
        if (
          (row === 1 && col === 1) ||
          (row === 7 && col === 0) ||
          (row === 9 && col === 2)
        ) {
          baseOpacity = 0.4;
        }
        // Reducir opacity para efecto marca de agua (aumentado para mejor visibilidad)
        const watermarkOpacity = baseOpacity * 0.5;

        const topPercent = row * 10.1;
        const width = 33.33;
        const leftPercent = col * width;

        logos.push(
          <div
            key={`watermark-${row}-${col}`}
            className="absolute pointer-events-none"
            style={{
              top: `${topPercent}%`,
              left: `${leftPercent}%`,
              width: `${width}%`,
              height: "10.1%",
            }}
          >
            <div
              className="absolute inset-0"
              style={{ opacity: watermarkOpacity }}
            >
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

  // Pantalla de animación inicial
  if (stage === "animation") {
    return (
      <div
        className="relative w-full h-screen"
        style={{ position: "relative" }}
      >
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
        </div>
        {/* Footer de advertencia - 10% de la página - fuera del contenedor principal */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "10vh",
            minHeight: "60px",
            backgroundColor: "#FFFFFF",
            borderTop: "2px solid #000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 1rem",
            zIndex: 99999,
            boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p
            style={{
              color: "#000000",
              fontWeight: "bold",
              fontSize: "0.75rem",
              textAlign: "center",
              maxWidth: "64rem",
            }}
          >
            Este producto no es libre de riegos y contiene nicotina, que es
            adictiva, venta exclusiva para adultos.
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de formulario
  if (stage === "form") {
    return (
      <div className="bg-[#00a9df] relative w-full h-screen overflow-hidden flex items-center justify-center p-4 md:p-8">
        {/* Fondo de formulario aplicado a toda la pantalla */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <img
            alt=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-full max-h-full object-cover opacity-30"
            src={formBackground}
          />
        </div>

        <div className="relative w-full max-w-md h-full flex items-center justify-center z-10">
          <form
            onSubmit={handleFormSubmit}
            className="relative w-full flex flex-col items-center justify-center px-4 md:px-8"
          >
            {/* Avatar y Puntuación - muestra avatar a la izquierda y puntuación a la derecha */}
            {(() => {
              const avatarCode = registerData?.avatarCode;
              const avatarPath = avatarCode ? getAvatarPath(avatarCode) : null;
              const fraternityColor = avatarCode
                ? getFraternityColor(avatarCode)
                : null;
              // Siempre obtener un marco (genérico si no hay código o no se encuentra el específico)
              const fraternityFrame = avatarCode
                ? getFraternityFrame(avatarCode)
                : getFraternityFrame(""); // Pasar string vacío para obtener marco genérico
              const score = registerData?.score || 0;

              return (
                <div className="mb-6 md:mb-8 w-full max-w-xs md:max-w-sm flex items-center justify-between gap-4 md:gap-6">
                  {/* Avatar a la izquierda */}
                  <div className="w-[164px] h-[164px] md:w-[170px] md:h-[170px] lg:w-[186px] lg:h-[186px] rounded-full flex items-center justify-center relative flex-shrink-0">
                    {/* Marco genérico - siempre se muestra como capa más externa con color */}
                    <div
                      className="absolute inset-0 w-full h-full z-0"
                      style={{
                        backgroundColor: fraternityColor || "#FFFFFF",
                        maskImage: `url(${marcoGenerico})`,
                        WebkitMaskImage: `url(${marcoGenerico})`,
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                      }}
                    />

                    {/* Marco de fraternidad - dentro del marco genérico, un poco más pequeño con color */}
                    <div
                      className="absolute inset-0 w-4/5 h-4/5 z-10 m-auto"
                      style={{
                        backgroundColor: fraternityColor || "#FFFFFF",
                        maskImage: `url(${fraternityFrame})`,
                        WebkitMaskImage: `url(${fraternityFrame})`,
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                      }}
                    />

                    {/* Avatar dentro del marco - más pequeño para que el marco se vea alrededor */}
                    {avatarPath ? (
                      <img
                        src={avatarPath}
                        alt={`Avatar ${avatarCode}`}
                        className="relative z-20 w-1/2 h-1/2 object-contain"
                        onError={(e) => {
                          // Fallback si el avatar no se carga
                          e.target.style.display = "none";
                        }}
                      />
                    ) : null}

                    {/* Fallback: icono por defecto si no hay avatar ni foto de Google */}
                    {!avatarPath && !user?.photoURL && (
                      <div className="relative z-20 w-2/3 h-2/3 bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center rounded-full">
                        <svg
                          className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Puntuación a la derecha - solo si hay registerData */}
                  {registerData && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-white text-xs md:text-sm font-bold mb-1">
                          Puntuación
                        </p>
                        <p className="text-[#001175] text-4xl md:text-5xl lg:text-6xl font-bold">
                          {(registerData.score || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Level Up */}
            <h2
              className="text-[#001175] font-['Helvetica',sans-serif] text-[77.366px] font-bold leading-normal text-center mb-4 md:mb-6"
              style={{
                color: "#001175",
                fontFamily: "Helvetica",
                fontSize: "77.366px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Level Up
            </h2>

            {/* Logo ZYN con "by" como superíndice a la izquierda */}
            <div className="relative mb-8 md:mb-12 flex justify-center items-center">
              {/* "by" posicionado como superíndice a la izquierda superior */}
              <p
                className="absolute -left-8 md:-left-12 lg:-left-16 -top-2 md:-top-3 lg:-top-4 text-[#001175] font-['Helvetica',sans-serif] text-[28.833px] font-bold leading-normal"
                style={{
                  color: "#001175",
                  fontFamily: "Helvetica",
                  fontSize: "28.833px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                by
              </p>
              {/* Logo ZYN */}
              <div className="relative w-48 h-24 md:w-56 md:h-28 lg:w-64 lg:h-32">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    alt="ZYN"
                    className="absolute left-0 max-w-none w-full h-full top-0 object-contain"
                    src={zynLogoForm}
                  />
                </div>
              </div>
            </div>

            {/* Label sobre contenedor blanco */}
            <div className="mb-4 md:mb-6 w-full max-w-[16rem] md:max-w-[20rem]">
              <div className="bg-white rounded-[47.647px] px-2.5 md:px-3 py-2 md:py-2.5 shadow-lg">
                <p className="font-['Helvetica',sans-serif] font-bold text-xs md:text-sm text-[#001175] text-center">
                  Cada jugada cuenta, cada bolsita te lleva al siguiente nivel
                </p>
              </div>
            </div>

            <div className="w-full max-w-xs md:max-w-sm mb-4 md:mb-6">
              <div className="relative bg-white rounded-[47.647px] h-12 md:h-14 lg:h-16">
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="absolute inset-0 bg-transparent rounded-[47.647px] w-full h-full px-4 md:px-6 font-['Helvetica',sans-serif] font-bold text-sm md:text-base lg:text-[20px] text-[#898d90] placeholder-[#898d90] outline-none border-none"
                  placeholder="NOMBRE COMPLETO"
                  required
                />
              </div>
            </div>

            <div className="w-full max-w-xs md:max-w-sm mb-4 md:mb-6">
              <div className="relative bg-white rounded-[47.647px] h-12 md:h-14 lg:h-16">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="absolute inset-0 bg-transparent rounded-[47.647px] w-full h-full px-4 md:px-6 font-['Helvetica',sans-serif] font-bold text-sm md:text-base lg:text-[20px] text-[#898d90] placeholder-[#898d90] outline-none border-none"
                  placeholder="CORREO ELECTRÓNICO"
                  required
                />
              </div>
            </div>

            {/* Botón ENVIAR - Formulario manual (arriba) */}
            <button
              type="submit"
              disabled={loading}
              className="relative bg-white rounded-[47.647px] px-6 md:px-8 lg:px-10 h-12 md:h-14 lg:h-[54px] font-['Helvetica',sans-serif] font-bold text-sm md:text-base lg:text-[23.824px] text-[#001175] cursor-pointer shadow-lg transition-all duration-150 select-none mb-4 md:mb-6
                hover:bg-[#001175] hover:text-white hover:shadow-2xl
                active:scale-95 active:shadow-md w-auto inline-block disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ paddingLeft: "70px", paddingRight: "70px" }}
            >
              {loading ? "Guardando..." : "ENVIAR"}
            </button>

            {/* Separador "O" */}
            <div className="relative flex items-center justify-center w-full max-w-xs md:max-w-sm mb-4 md:mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative bg-[#00a9df] px-4">
                <span className="text-white text-sm font-bold">O</span>
              </div>
            </div>

            {/* Botón de Google Sign In (abajo) */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="relative bg-white rounded-[47.647px] px-6 md:px-8 lg:px-10 h-12 md:h-14 lg:h-[54px] font-['Helvetica',sans-serif] font-bold text-sm md:text-base lg:text-[23.824px] text-[#001175] cursor-pointer shadow-lg transition-all duration-150 select-none
                hover:bg-[#001175] hover:text-white hover:shadow-2xl
                active:scale-95 active:shadow-md w-auto inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Cargando..."
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar con Google
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Pantalla de confirmación
  return (
    <div className="bg-[#00a9df] relative w-full min-h-screen overflow-hidden">
      {/* Serpentinas/Confeti cayendo desde arriba - solo por 3 segundos */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {renderConfetti()}
        </div>
      )}

      {/* Grid de logos como marca de agua */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {renderWatermarkGrid()}
      </div>

      <div className="relative w-full min-h-screen flex items-center justify-center p-4 md:p-8 z-10">
        <div className="relative w-full max-w-2xl flex flex-col items-center justify-center">
          {/* Level Up */}
          <h2
            className="text-[#001175] font-['Helvetica',sans-serif] text-[77.366px] font-bold leading-normal text-center mb-4 md:mb-6"
            style={{
              color: "#001175",
              fontFamily: "Helvetica",
              fontSize: "77.366px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Level Up
          </h2>

          {/* Logo ZYN con "by" como superíndice a la izquierda */}
          <div className="relative mb-8 md:mb-12 flex justify-center items-center">
            {/* "by" posicionado como superíndice a la izquierda superior */}
            <p
              className="absolute -left-8 md:-left-12 lg:-left-16 -top-2 md:-top-3 lg:-top-4 text-[#001175] font-['Helvetica',sans-serif] text-[28.833px] font-bold leading-normal"
              style={{
                color: "#001175",
                fontFamily: "Helvetica",
                fontSize: "28.833px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              by
            </p>
            {/* Logo ZYN */}
            <div className="relative w-48 h-24 md:w-56 md:h-28 lg:w-64 lg:h-32">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  alt="ZYN"
                  className="absolute left-0 max-w-none w-full h-full top-0 object-contain"
                  src={zynLogoConfirmation}
                />
              </div>
            </div>
          </div>

          {/* Label sobre contenedor blanco */}
          <div className="mb-4 md:mb-6 w-full max-w-[16rem] md:max-w-[20rem]">
            <div className="bg-white rounded-[47.647px] px-2.5 md:px-3 py-2 md:py-2.5 shadow-lg">
              <p className="font-['Helvetica',sans-serif] font-bold text-xs md:text-sm text-[#001175] text-center">
                Cada jugada cuenta, cada bolsita te lleva al siguiente nivel
              </p>
            </div>
          </div>

          {/* Indicador de éxito "Enviado" - diseño destacado */}
          <div className="relative flex flex-col items-center justify-center mt-8 md:mt-12">
            <div className="relative bg-white rounded-full px-8 md:px-12 lg:px-16 py-4 md:py-6 lg:py-8 shadow-lg">
              <div className="flex items-center gap-3 md:gap-4">
                {/* Checkmark grande */}
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-[#001175] flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                {/* Texto "Enviado" */}
                <p
                  className="text-[#001175] font-['Helvetica',sans-serif] text-2xl md:text-3xl lg:text-4xl font-bold leading-normal"
                  style={{
                    color: "#001175",
                    fontFamily: "Helvetica",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Enviado
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer de advertencia - 10% de la página */}
      <div className="fixed bottom-0 left-0 right-0 h-[10vh] min-h-[60px] bg-white border-t-2 border-black flex items-center justify-center px-4 z-[9999] shadow-lg">
        <p className="text-black font-bold text-xs md:text-sm text-center max-w-4xl">
          Este producto no es libre de riegos y contiene nicotina, que es
          adictiva, venta exclusiva para adultos.
        </p>
      </div>
    </div>
  );
}
