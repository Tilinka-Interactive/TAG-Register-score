import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBestScoresByUser, formatTiempoJuego } from "../services/scoreService";
import { getAvatarPath, getFraternityColor, getFraternityFrame } from "../utils/avatarUtils";
import zynLogoForm from "../assets/zyn-logo-form.png";

// Mapeo de letras a nombres de fraternidades
const FRATERNIDADES_MAP = {
  'A': 'MOSQUETEROS',
  'B': 'FASTIDIADOS',
  'C': 'CODICIADOS',
  'D': 'FACHADAZOS',
  'E': 'TAITAS TAITAS',
  'F': 'CAMBAS FLOJONAZOS',
  'G': 'DESDICHADOS',
  'H': 'PRETENCIOSOS',
  'I': 'OSTENTADOS',
  'J': 'DENEGADOS',
  'K': 'PRESTIGIADOS',
  'L': 'FLOJONAZOS',
  'M': 'SOCIOS JR',
  'N': 'ENVIDIADOS',
  'O': 'JAREROS',
  'P': 'FRAT MORE'
};

// Obtener la letra de la fraternidad del avatarCode (cuarto carácter: A-P)
const getFraternityLetterFromAvatarCode = (avatarCode) => {
  if (!avatarCode || avatarCode.length < 4) {
    return null;
  }
  return avatarCode.charAt(3).toUpperCase();
};

// Obtener el nombre de la fraternidad del avatarCode
const getFraternityNameFromAvatarCode = (avatarCode) => {
  const letter = getFraternityLetterFromAvatarCode(avatarCode);
  return letter && FRATERNIDADES_MAP[letter] ? FRATERNIDADES_MAP[letter] : null;
};

// Lista de fraternidades válidas (A-P)
const FRATERNIDADES_LETTERS = Object.keys(FRATERNIDADES_MAP);

export default function Dashboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("score"); // score, tiempo, fraternidad
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [filterFraternidad, setFilterFraternidad] = useState("");
  const [fraternidades, setFraternidades] = useState([]);
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    promedioScore: 0,
    scoreMaximo: 0,
    scoreMinimo: 0,
    totalFraternidades: 0,
  });

  useEffect(() => {
    loadScores();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [scores, sortBy, sortOrder, filterFraternidad]);

  const loadScores = async () => {
    setLoading(true);
    try {
      const result = await getBestScoresByUser();
      if (result.success) {
        setScores(result.data);
        
        // Extraer fraternidades únicas basadas en avatarCode (A-P)
        const uniqueFraternidades = [...new Set(
          result.data
            .map(s => getFraternityNameFromAvatarCode(s.avatarCode))
            .filter(f => f)
        )].sort();
        setFraternidades(uniqueFraternidades);
        
        // Calcular estadísticas
        calculateStats(result.data);
      }
    } catch (error) {
      console.error("Error al cargar scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({
        totalUsuarios: 0,
        promedioScore: 0,
        scoreMaximo: 0,
        scoreMinimo: 0,
        totalFraternidades: 0,
      });
      return;
    }
    
    // Filtrar scores válidos (solo números)
    const scoresList = data
      .map(s => s.score)
      .filter(score => typeof score === 'number' && !isNaN(score) && score !== null && score !== undefined);
    
    const uniqueFraternidades = new Set(
      data
        .map(s => getFraternityNameFromAvatarCode(s.avatarCode))
        .filter(f => f)
    );
    
    let promedioScore = 0;
    let scoreMaximo = 0;
    let scoreMinimo = 0;
    
    if (scoresList.length > 0) {
      promedioScore = Math.round(scoresList.reduce((a, b) => a + b, 0) / scoresList.length);
      scoreMaximo = Math.max(...scoresList);
      scoreMinimo = Math.min(...scoresList);
    }
    
    setStats({
      totalUsuarios: data.length,
      promedioScore: promedioScore || 0,
      scoreMaximo: scoreMaximo || 0,
      scoreMinimo: scoreMinimo || 0,
      totalFraternidades: uniqueFraternidades.size,
    });
  };

  const applyFiltersAndSort = () => {
    let filtered = [...scores];
    
    // Filtrar por fraternidad (basado en avatarCode)
    if (filterFraternidad) {
      filtered = filtered.filter(s => {
        const fraternity = getFraternityNameFromAvatarCode(s.avatarCode);
        return fraternity === filterFraternidad;
      });
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "score":
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
        case "tiempo":
          aValue = a.tiempoJuego || 0;
          bValue = b.tiempoJuego || 0;
          break;
        case "fraternidad":
          aValue = (getFraternityNameFromAvatarCode(a.avatarCode) || "").toLowerCase();
          bValue = (getFraternityNameFromAvatarCode(b.avatarCode) || "").toLowerCase();
          break;
        default:
          aValue = a.score || 0;
          bValue = b.score || 0;
      }
      
      if (sortBy === "fraternidad") {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc" 
          ? aValue - bValue
          : bValue - aValue;
      }
    });
    
    setFilteredScores(filtered);
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  return (
    <div className="bg-[#00a9df] min-h-screen w-full">
      {/* Header */}
      <header className="bg-[#001175] text-white p-4 md:p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={zynLogoForm} 
              alt="ZYN" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
            <h1 className="font-['Helvetica',sans-serif] font-bold text-xl md:text-2xl lg:text-3xl">
              Dashboard de Estadísticas
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-white text-[#001175] px-4 py-2 rounded-lg font-bold hover:bg-[#00a9df] hover:text-white transition-colors"
          >
            Volver
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Estadísticas generales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="text-[#898d90] text-sm font-bold mb-1">Total Usuarios</p>
            <p className="text-[#001175] text-2xl md:text-3xl font-bold">{stats.totalUsuarios}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="text-[#898d90] text-sm font-bold mb-1">Score Promedio</p>
            <p className="text-[#001175] text-2xl md:text-3xl font-bold">{stats.promedioScore}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="text-[#898d90] text-sm font-bold mb-1">Score Máximo</p>
            <p className="text-[#001175] text-2xl md:text-3xl font-bold">{stats.scoreMaximo}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="text-[#898d90] text-sm font-bold mb-1">Fraternidades</p>
            <p className="text-[#001175] text-2xl md:text-3xl font-bold">{stats.totalFraternidades}</p>
          </div>
        </div>

        {/* Filtros y ordenamiento */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Filtro por fraternidad */}
              <div className="flex-1">
                <label className="block text-[#001175] font-bold text-sm mb-2">
                  Filtrar por Fraternidad
                </label>
                <select
                  value={filterFraternidad}
                  onChange={(e) => setFilterFraternidad(e.target.value)}
                  className="w-full bg-white border-2 border-[#001175] rounded-lg px-4 py-2 text-[#001175] font-bold focus:outline-none focus:ring-2 focus:ring-[#00a9df]"
                >
                  <option value="">Todas las fraternidades</option>
                  {fraternidades.map((fraternidad) => (
                    <option key={fraternidad} value={fraternidad}>
                      {fraternidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenamiento */}
              <div className="flex-1">
                <label className="block text-[#001175] font-bold text-sm mb-2">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full bg-white border-2 border-[#001175] rounded-lg px-4 py-2 text-[#001175] font-bold focus:outline-none focus:ring-2 focus:ring-[#00a9df]"
                >
                  <option value="score">Puntuación</option>
                  <option value="tiempo">Tiempo de Juego</option>
                  <option value="fraternidad">Fraternidad</option>
                </select>
              </div>
            </div>

            {/* Botón de orden */}
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-[#001175] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#00a9df] transition-colors mt-6 md:mt-0"
            >
              {sortOrder === "asc" ? "↑ Ascendente" : "↓ Descendente"}
            </button>
          </div>
        </div>

        {/* Tabla de scores */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-[#001175] font-bold text-lg">Cargando estadísticas...</p>
            </div>
          ) : filteredScores.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[#898d90] font-bold text-lg">No hay datos disponibles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#001175] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-sm md:text-base">#</th>
                    <th className="px-4 py-3 text-left font-bold text-sm md:text-base">Nombre</th>
                    <th className="px-4 py-3 text-left font-bold text-sm md:text-base">Email</th>
                    <th className="px-4 py-3 text-left font-bold text-sm md:text-base">Fraternidad</th>
                    <th className="px-4 py-3 text-left font-bold text-sm md:text-base cursor-pointer hover:bg-[#00a9df]" onClick={() => handleSort("score")}>
                      Score {sortBy === "score" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm md:text-base cursor-pointer hover:bg-[#00a9df]" onClick={() => handleSort("tiempo")}>
                      Tiempo {sortBy === "tiempo" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-sm md:text-base">Avatar</th>
                    <th className="px-4 py-3 text-left font-bold text-sm md:text-base">Código</th>
                    <th className="px-4 py-3 text-left font-bold text-sm md:text-base">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScores.map((score, index) => (
                    <tr
                      key={score.id}
                      className="border-b border-gray-200 hover:bg-[#00a9df]/10 transition-colors"
                    >
                      <td className="px-4 py-3 text-[#001175] font-bold">{index + 1}</td>
                      <td className="px-4 py-3 text-[#001175] font-bold">{score.nombre || "N/A"}</td>
                      <td className="px-4 py-3 text-[#898d90] text-sm">{score.email || "N/A"}</td>
                      <td className="px-4 py-3 text-[#001175] font-bold">
                        {getFraternityNameFromAvatarCode(score.avatarCode) || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-[#001175] font-bold text-lg">{score.score || 0}</td>
                      <td className="px-4 py-3 text-[#898d90]">{formatTiempoJuego(score.tiempoJuego)}</td>
                      <td className="px-4 py-3">
                        {score.avatarCode ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden flex-shrink-0 relative"
                              style={{
                                borderColor: getFraternityColor(score.avatarCode),
                              }}
                            >
                              {/* Marco de fraternidad como fondo */}
                              <img
                                src={getFraternityFrame(score.avatarCode)}
                                alt="Marco de fraternidad"
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              {/* Avatar dentro del marco */}
                              {getAvatarPath(score.avatarCode) ? (
                                <img
                                  src={getAvatarPath(score.avatarCode)}
                                  alt={`Avatar ${score.avatarCode}`}
                                  className="relative z-10 w-4/5 h-4/5 object-contain"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="relative z-10 w-full h-full bg-white/20 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">
                                    {score.avatarCode.substring(0, 2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#001175] font-bold">{score.avatarCode || "N/A"}</td>
                      <td className="px-4 py-3 text-[#898d90] text-sm">
                        {score.createdAt
                          ? new Date(score.createdAt).toLocaleDateString("es-ES")
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Gráficas recomendadas */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gráfica de fraternidades */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
            <h2 className="text-[#001175] font-bold text-lg md:text-xl mb-4">
              Scores por Fraternidad
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {fraternidades.slice(0, 8).map((fraternidad) => {
                const fraternidadScores = filteredScores.filter(
                  (s) => getFraternityNameFromAvatarCode(s.avatarCode) === fraternidad
                );
                const promedio = fraternidadScores.length > 0
                  ? Math.round(
                      fraternidadScores.reduce((sum, s) => sum + (s.score || 0), 0) /
                        fraternidadScores.length
                    )
                  : 0;
                
                return (
                  <div key={fraternidad} className="flex items-center justify-between">
                    <span className="text-[#001175] font-bold text-sm flex-1 truncate">
                      {fraternidad}
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex-1 bg-[#00a9df]/20 rounded-full h-4">
                        <div
                          className="bg-[#001175] h-full rounded-full"
                          style={{
                            width: `${stats.scoreMaximo > 0 ? (promedio / stats.scoreMaximo) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-[#898d90] font-bold text-sm w-16 text-right">
                        {promedio}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top 10 Mejores Scores */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
            <h2 className="text-[#001175] font-bold text-lg md:text-xl mb-4">
              Top 10 Mejores Scores
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredScores
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .slice(0, 10)
                .map((score, index) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-[#00a9df]/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#001175] font-bold text-sm w-6">
                        {index + 1}
                      </span>
                      <span className="text-[#001175] font-bold text-sm truncate max-w-[120px]">
                        {score.nombre || "N/A"}
                      </span>
                    </div>
                    <span className="text-[#001175] font-bold">{score.score || 0}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Gráfica de tiempo promedio por fraternidad */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
            <h2 className="text-[#001175] font-bold text-lg md:text-xl mb-4">
              Tiempo Promedio por Fraternidad
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {fraternidades.slice(0, 8).map((fraternidad) => {
                const fraternidadScores = filteredScores.filter(
                  (s) => getFraternityNameFromAvatarCode(s.avatarCode) === fraternidad
                );
                const tiempoPromedio = fraternidadScores.length > 0
                  ? Math.round(
                      fraternidadScores.reduce((sum, s) => sum + (s.tiempoJuego || 0), 0) /
                        fraternidadScores.length
                    )
                  : 0;
                
                return (
                  <div key={fraternidad} className="flex items-center justify-between">
                    <span className="text-[#001175] font-bold text-sm flex-1 truncate">
                      {fraternidad}
                    </span>
                    <span className="text-[#898d90] font-bold text-sm">
                      {formatTiempoJuego(tiempoPromedio)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Método de registro */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
            <h2 className="text-[#001175] font-bold text-lg md:text-xl mb-4">
              Método de Registro
            </h2>
            <div className="space-y-3">
              {[
                { method: "google", label: "Google", color: "#4285F4" },
                { method: "manual", label: "Manual", color: "#001175" },
              ].map(({ method, label, color }) => {
                const count = filteredScores.filter(
                  (s) => s.registrationMethod === method
                ).length;
                const percentage = filteredScores.length > 0 
                  ? (count / filteredScores.length) * 100 
                  : 0;
                
                return (
                  <div key={method}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#001175] font-bold text-sm">{label}</span>
                      <span className="text-[#898d90] font-bold text-sm">{count}</span>
                    </div>
                    <div className="bg-[#00a9df]/20 rounded-full h-4">
                      <div
                        className="rounded-full h-4 transition-all duration-300"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Registros por fecha */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
            <h2 className="text-[#001175] font-bold text-lg md:text-xl mb-4">
              Registros Recientes
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredScores
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .slice(0, 10)
                .map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-[#00a9df]/10 text-sm"
                  >
                    <div className="flex-1">
                      <p className="text-[#001175] font-bold truncate">
                        {score.nombre || "N/A"}
                      </p>
                      <p className="text-[#898d90] text-xs">
                        {score.createdAt
                          ? new Date(score.createdAt).toLocaleString("es-ES")
                          : "N/A"}
                      </p>
                    </div>
                    <span className="text-[#001175] font-bold ml-2">{score.score || 0}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

