import { useState, useEffect } from "react";

// Images - Local assets
import zynLogoGrid from "../assets/zyn-logo-grid.png";
import miniPacketOpen from "../assets/mini-packet-open.png";
import formBackground from "../assets/form-background.png";
import zynLogoForm from "../assets/zyn-logo-form.png";
import zynLogoConfirmation from "../assets/zyn-logo-confirmation.png";

// Estados: 'animation' | 'form' | 'confirmation'
export default function MainScreen() {
  const [stage, setStage] = useState("animation");
  const [formData, setFormData] = useState({ nombre: "", email: "" });

  // Animación inicial por 3 segundos
  useEffect(() => {
    if (stage === "animation") {
      const timer = setTimeout(() => {
        setStage("form");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre && formData.email) {
      setStage("confirmation");
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
      <div className="bg-[#00a9df] relative w-full h-screen overflow-hidden">
        {renderLogoGrid()}
        <div
          className="absolute inset-[27.38%_7.48%_27.38%_7.5%] md:inset-[27.38%_7.48%_27.38%_7.5%] animate-fadeIn"
          data-name="mini-packet-open"
        >
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
          {/* Logo ZYN en la parte superior izquierda */}
          <div className="absolute top-[3px] left-2 md:left-2 z-20">
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  alt="ZYN"
                  className="absolute left-0 max-w-none w-full h-full top-0 object-contain"
                  src={zynLogoForm}
                />
              </div>
            </div>
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="relative w-full flex flex-col items-center justify-center px-4 md:px-8"
          >
            {/* Avatar placeholder arriba de Level Up */}
            <div className="mb-6 md:mb-8 w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center">
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
            </div>

            <h1 className="font-['Helvetica',sans-serif] font-bold text-[#001175] text-6xl md:text-6xl lg:text-[56.537px] mb-4 md:mb-6 text-center">
              Level Up
            </h1>
            <p className="font-['Helvetica',sans-serif] font-bold text-white text-lg md:text-xl lg:text-[23.824px] mb-8 md:mb-12 text-center">
              Tu registro
            </p>

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

            <div className="w-full max-w-xs md:max-w-sm mb-6 md:mb-8">
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

            <button
              type="submit"
              className="relative bg-white rounded-[47.647px] px-6 md:px-8 lg:px-10 h-12 md:h-14 lg:h-[54px] font-['Helvetica',sans-serif] font-bold text-sm md:text-base lg:text-[23.824px] text-[#001175] cursor-pointer shadow-lg transition-all duration-150 select-none
                hover:bg-[#001175] hover:text-white hover:shadow-2xl
                active:scale-95 active:shadow-md w-auto inline-block"
              style={{ paddingLeft: "70px", paddingRight: "70px" }}
            >
              ENVIAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Pantalla de confirmación
  return (
    <div className="bg-[#00a9df] relative w-full min-h-screen overflow-hidden">
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
    </div>
  );
}
