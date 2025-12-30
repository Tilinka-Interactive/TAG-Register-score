import { useLocation, useNavigate } from "react-router-dom";
import zynLogoConfirmation from "../assets/zyn-logo-confirmation.png";
import zynLogoGrid from "../assets/zyn-logo-grid.png";

export default function RegisterSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, avatarCode } = location.state || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001175] to-[#0033cc] relative overflow-hidden">
      {/* Background con watermark */}
      <div className="absolute inset-0 opacity-20">
        <img
          src={zynLogoGrid}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-md w-full mx-4 text-center">
        {/* ZYN Logo con "by" */}
        <div className="relative flex justify-center items-center mb-8">
          <span className="absolute -top-4 -left-8 md:-left-12 text-[#001175] font-['Helvetica',sans-serif] font-bold text-xl md:text-[28.833px] z-10">
            by
          </span>
          <img
            src={zynLogoConfirmation}
            alt="ZYN Logo"
            className="h-16 md:h-20 w-auto"
          />
        </div>

        {/* Enviado Message */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl mb-6">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-white"
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
            <h2 className="text-4xl md:text-5xl font-bold text-[#001175] mb-4">
              Enviado
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-[#001175] mb-2">
              ¡Felicidades!
            </p>
            <p className="text-gray-600 text-lg">
              Tu registro ha sido guardado exitosamente
            </p>
          </div>

          {score && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-bold">Puntaje:</span> {score}
              </p>
              {avatarCode && (
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Código Avatar:</span> {avatarCode}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

