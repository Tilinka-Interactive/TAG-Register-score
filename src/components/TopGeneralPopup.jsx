import { useState, useEffect } from "react";
import { getTopGeneral } from "../services/scoreService";
import {
  getAvatarPath,
  getFraternityColor,
  getFraternityFrame,
} from "../utils/avatarUtils";
import marcoGenerico from "../assets/Marco.png";

export default function TopGeneralPopup({ isOpen, onClose }) {
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTopGeneral();
    }
  }, [isOpen]);

  const loadTopGeneral = async () => {
    setLoading(true);
    try {
      const result = await getTopGeneral();
      if (result.success) {
        setTopScores(result.data);
      } else {
        console.error("Error al cargar top general:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#001175] font-['Helvetica',sans-serif]">
            Top General
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando...</p>
          </div>
        )}

        {/* Top 3 List */}
        {!loading && (
          <div className="space-y-3">
            {topScores.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                No hay puntuaciones disponibles aún.
              </p>
            ) : (
              topScores.map((score, index) => {
                const fraternityColor = getFraternityColor(
                  score.avatarCode || ""
                );
                const avatarPath = getAvatarPath(score.avatarCode || "");
                const fraternityFrame = getFraternityFrame(
                  score.avatarCode || ""
                );

                return (
                  <div
                    key={score.id || index}
                    className="relative flex items-center gap-3 md:gap-4 py-2 px-3 md:py-2.5 md:px-4 rounded-xl bg-[#e6f4f9]"
                  >
                    {/* Posición - esquina superior izquierda */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full bg-[#001175] text-white font-bold text-xs md:text-sm z-30">
                      {index + 1}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center relative">
                      {/* Marco genérico con color de fraternidad */}
                      <div
                        className="absolute inset-0 w-full h-full z-0"
                        style={{
                          backgroundColor: fraternityColor,
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
                      {/* Marco de fraternidad azul */}
                      <div
                        className="absolute inset-0 w-4/5 h-4/5 z-10 m-auto"
                        style={{
                          backgroundColor: "#001175",
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
                      {/* Avatar */}
                      {avatarPath && (
                        <img
                          src={avatarPath}
                          alt={`Avatar ${score.avatarCode}`}
                          className="relative z-20 w-[35.71%] h-[35.71%] object-contain"
                        />
                      )}
                    </div>

                    {/* Información */}
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm sm:text-base md:text-lg text-[#001175] line-clamp-2">
                        {score.nombre || "Sin nombre"}
                      </p>
                    </div>

                    {/* Puntuación */}
                    <div className="flex-shrink-0 text-right">
                      <p className="font-bold text-base sm:text-lg md:text-xl text-[#001175]">
                        {score.score?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
