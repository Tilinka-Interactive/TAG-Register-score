import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const imgRectangle = "https://www.figma.com/api/mcp/asset/84edccb1-1dae-4600-895d-ae9d74a6d16f"
const imgRectangle1 = "https://www.figma.com/api/mcp/asset/4c066d0f-cd0c-429c-b3a3-8bbf644966ad"

export default function Screen2() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/screen3')
    }, 3000) // Auto-navigate after 3 seconds

    return () => clearTimeout(timer)
  }, [navigate])

  const renderLogoGrid = () => {
    const rows = 10
    const cols = 3
    const logos = []

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let opacity = 0.15
        // Specific positions with different opacity based on design
        if ((row === 1 && col === 1) || (row === 7 && col === 0) || (row === 9 && col === 2)) {
          opacity = 0.4
        }

        const topPercent = row * 10.1
        const width = 33.33 // Each column takes 1/3 of width
        const leftPercent = col * width

        logos.push(
          <div
            key={`${row}-${col}`}
            className="absolute"
            style={{
              top: `${topPercent}%`,
              left: `${leftPercent}%`,
              width: `${width}%`,
              height: '10.1%',
            }}
          >
            <div className="absolute inset-0" style={{ opacity }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="" className="absolute left-0 max-w-none w-full h-full top-0 object-contain" src={imgRectangle} />
              </div>
            </div>
          </div>
        )
      }
    }

    return logos
  }

  return (
    <a
      className="bg-[#00a9df] block cursor-pointer relative w-full h-screen overflow-hidden"
      data-name="iPhone 16 - 2"
      data-node-id="5:111"
      onClick={() => navigate('/screen3')}
    >
      {renderLogoGrid()}
      <div className="absolute inset-[27.38%_7.48%_27.38%_7.5%]" data-name="mini-packet-open" data-node-id="7:434">
        <div className="absolute inset-[27.38%_7.48%_27.38%_7.5%]" data-name="Group" data-node-id="7:435">
          <div className="absolute inset-[27.38%_7.48%_27.38%_7.5%]" data-name="Rectangle" data-node-id="7:436">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none w-full h-full top-0" src={imgRectangle1} />
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

