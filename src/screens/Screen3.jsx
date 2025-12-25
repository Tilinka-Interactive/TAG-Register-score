import { useNavigate } from 'react-router-dom'

const imgRectangle = "https://www.figma.com/api/mcp/asset/a7a183c7-e1ad-4814-a3eb-29ad31f1651f"
const imgCapa21 = "https://www.figma.com/api/mcp/asset/edc36120-4cd1-42bc-b9fc-9b1c27271e88"
const imgRectangle1 = "https://www.figma.com/api/mcp/asset/4f98029f-c69c-4167-b578-24ca2a340c2f"
const imgRectangle2 = "https://www.figma.com/api/mcp/asset/87f01c5a-8afe-41e9-920e-718c854b2f21"
const imgRectangle3 = "https://www.figma.com/api/mcp/asset/f6b88ed9-be0d-498c-8392-b4b89ee9fc8a"

function Group({ className, onClick }) {
  return (
    <a className={className} data-node-id="9:422" onClick={onClick}>
      <div className="absolute bg-white inset-0 rounded-[47.647px]" data-node-id="9:420" />
      <div className="absolute flex flex-col font-['Helvetica',sans-serif] font-bold inset-[26.47%_14.46%_23.53%_15.08%] justify-center leading-0 not-italic text-[#001175] text-[23.824px] text-center whitespace-nowrap" data-node-id="9:9">
        <p className="leading-normal">GET SCORE</p>
      </div>
    </a>
  )
}

export default function Screen3() {
  const navigate = useNavigate()

  const renderLogoGrid = () => {
    const logos = []
    const positions = [
      { top: 30.31, left: -151.71, right: -49.78, opacity: 0.15 },
      { top: 30.31, left: -101.19, right: 151.41, opacity: 0.15 },
      { top: 30.31, left: -151.71, right: 201.93, opacity: 0.15 },
      { top: 70.65, left: 103.79, right: -155.5, opacity: 0.15 },
      { top: 70.65, left: 154.31, right: -104.09, opacity: 0.15 },
      { top: 70.65, left: 103.79, right: -53.57, opacity: 0.15 },
      { top: 60.55, left: -151.71, right: -49.78, opacity: 0.15 },
      { top: 60.55, left: -101.19, right: 151.41, opacity: 0.15 },
      { top: 60.55, left: -151.71, right: 201.93, opacity: 0.15 },
      { top: 50.45, left: 100.04, right: -151.75, opacity: 0.15 },
      { top: 50.45, left: 150.56, right: -100.34, opacity: 0.15 },
      { top: 50.45, left: 100.04, right: -49.82, opacity: 0.15 },
      { top: 40.42, left: 99.04, right: -150.75, opacity: 0.15 },
      { top: 40.42, left: 149.56, right: -99.34, opacity: 0.15 },
      { top: 40.42, left: 99.04, right: -48.82, opacity: 0.15 },
      { top: 0, left: 99.54, right: -151.25, opacity: 0.15 },
      { top: 0, left: 150.06, right: -99.84, opacity: 0.15 },
      { top: 0, left: 99.54, right: -49.32, opacity: 0.4 },
      { top: 20.21, left: 100.04, right: -151.75, opacity: 0.4 },
      { top: 20.21, left: 150.56, right: -100.34, opacity: 0.15 },
      { top: 20.21, left: 100.04, right: -49.82, opacity: 0.15 },
      { top: 10.1, left: -151.71, right: -49.78, opacity: 0.15 },
      { top: 10.1, left: -101.19, right: 151.41, opacity: 0.15 },
      { top: 10.1, left: -151.71, right: 201.93, opacity: 0.15 },
      { top: 90.86, left: -151.71, right: -49.78, opacity: 0.15 },
      { top: 90.86, left: -101.19, right: 151.41, opacity: 0.15 },
      { top: 90.86, left: -151.71, right: 201.93, opacity: 0.15 },
      { top: 80.76, left: -151.71, right: -49.78, opacity: 0.15 },
      { top: 80.76, left: -101.19, right: 151.41, opacity: 0.4 },
      { top: 80.76, left: -151.71, right: 201.93, opacity: 0.15 },
    ]

    positions.forEach((pos, index) => {
      logos.push(
        <div
          key={index}
          className="absolute"
          style={{
            top: `${pos.top}%`,
            bottom: `${100 - pos.top - 10.1}%`,
            left: pos.left > 0 ? undefined : `${pos.left}%`,
            right: pos.right > 0 ? undefined : `${pos.right}%`,
          }}
        >
          <div className="absolute inset-0" style={{ opacity: pos.opacity }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none w-full h-full top-0" src={imgRectangle} />
            </div>
          </div>
        </div>
      )
    })

    return logos
  }

  return (
    <div className="bg-[#00a9df] relative w-full h-screen overflow-hidden" data-name="iPhone 16 - 3" data-node-id="5:213">
      {renderLogoGrid()}
      <div className="absolute h-[800px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[398px]" data-name="Capa-21" data-node-id="9:2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none w-full h-full top-0" src={imgCapa21} />
        </div>
      </div>
      <div className="absolute inset-[59.13%_34.25%_34.5%_32%] rounded-[30px]" data-name="Rectangle" data-node-id="9:7">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[30px]">
          <img alt="" className="absolute left-0 max-w-none w-full h-full top-0" src={imgRectangle1} />
        </div>
      </div>
      <div className="absolute inset-[34.38%_0_47.25%_0]" data-name="Rectangle" data-node-id="9:12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none w-full h-full top-0" src={imgRectangle2} />
        </div>
      </div>
      <p className="absolute font-['Helvetica',sans-serif] font-bold inset-[36.59%_9.64%_52.28%_9.61%] leading-normal not-italic text-[#001175] text-[77.366px]">
        Level Up
      </p>
      <p className="absolute font-['Helvetica',sans-serif] font-bold inset-[47.02%_72.58%_48.86%_18.92%] leading-normal not-italic text-[#001175] text-[28.833px]">
        by
      </p>
      <div className="absolute inset-[48.54%_24.4%_43.15%_30.63%]" data-name="Rectangle" data-node-id="9:19">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none w-full h-full top-0" src={imgRectangle3} />
        </div>
      </div>
      <Group
        className="absolute block cursor-pointer h-[54px] left-1/2 shadow-[0px_6.353px_6.353px_0px_#001175] top-[484px] -translate-x-1/2 w-[200.118px]"
        onClick={() => navigate('/screen4')}
      />
    </div>
  )
}

