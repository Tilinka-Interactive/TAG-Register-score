import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const imgCapa21 = "https://www.figma.com/api/mcp/asset/65c11d50-4ade-40bb-b2b1-8993eb2c4fbb"
const imgRectangle = "https://www.figma.com/api/mcp/asset/a10d7367-7d10-430e-b202-f28676433cce"

function Group({ className, onClick }) {
  return (
    <a className={className} data-node-id="13:457" onClick={onClick}>
      <div className="absolute contents inset-0" data-node-id="13:454">
        <div className="absolute bg-white inset-0 rounded-[47.647px]" data-node-id="13:443" />
      </div>
      <div className="absolute flex flex-col font-['Helvetica',sans-serif] font-bold inset-[26.47%_27.09%_23.53%_27.44%] justify-center leading-0 not-italic text-[#001175] text-[23.824px] text-center" data-node-id="13:444">
        <p className="leading-normal whitespace-pre-wrap">ENVIAR</p>
      </div>
    </a>
  )
}

export default function Screen4() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', { nombre, email })
    // You can add navigation or API call here
  }

  return (
    <div className="bg-[#00a9df] relative w-full h-screen overflow-hidden" data-name="iPhone 16 - 4" data-node-id="9:221">
      <div className="absolute h-[800px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[398px]" data-name="Capa-21" data-node-id="9:424">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none w-full h-full top-0" src={imgCapa21} />
        </div>
      </div>
      <div className="absolute inset-[2.25%_76.75%_94.38%_5%]" data-name="Objeto-inteligente-vectorial-copia-2" data-node-id="9:418">
        <div className="absolute inset-[2.25%_76.75%_94.38%_5%]" data-name="Rectangle" data-node-id="9:419">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute left-0 max-w-none w-full h-full top-0" src={imgRectangle} />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="w-full h-full">
        <p className="absolute font-['Helvetica',sans-serif] font-bold inset-[28.5%_20.25%_63.38%_20.75%] leading-normal not-italic text-[#001175] text-[56.537px]">
          Level Up
        </p>
        <div className="absolute flex flex-col font-['Helvetica',sans-serif] font-bold inset-[36.13%_34.5%_60.5%_34.75%] justify-center leading-0 not-italic text-[23.824px] text-center text-white whitespace-nowrap">
          <p className="leading-normal">Tu registro</p>
        </div>
        <div className="absolute inset-[43.88%_6.5%_50.38%_6.75%]" data-node-id="13:452">
          <div className="absolute bg-white inset-0 rounded-[47.647px]" data-node-id="13:446" />
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="absolute inset-0 bg-transparent rounded-[47.647px] w-full h-full px-[12.5%] font-['Helvetica',sans-serif] font-bold text-[20px] text-[#898d90] placeholder-[#898d90] outline-none border-none"
            placeholder="NOMBRE COMPLETO"
          />
        </div>
        <div className="absolute inset-[52%_6.5%_42.25%_6.75%]" data-node-id="13:453">
          <div className="absolute bg-white inset-0 rounded-[47.647px]" data-node-id="13:450" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="absolute inset-0 bg-transparent rounded-[47.647px] w-full h-full px-[12.5%] font-['Helvetica',sans-serif] font-bold text-[20px] text-[#898d90] placeholder-[#898d90] outline-none border-none"
            placeholder="CORREO ELECTRÓNICO"
          />
        </div>
        <Group
          className="absolute block cursor-pointer h-[54px] left-[62px] top-[496px] w-[277px]"
          onClick={handleSubmit}
        />
      </form>
    </div>
  )
}

