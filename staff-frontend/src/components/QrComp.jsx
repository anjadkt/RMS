import {QRCodeCanvas} from 'qrcode.react'
import {toPng} from 'html-to-image'
import api from '../services/axios.js'
import {useRef} from 'react'
import {QrCode ,Download} from 'lucide-react'

export default function QrComp({tableNumber}){
  if (!tableNumber) return null;

  const qrRef = useRef(null);
  const qrValue = `http://localhost:5174/cart?table=${tableNumber}`

  const downloadQr = async ()=>{
    const image = await toPng(qrRef.current);
    const link = document.createElement("a");
    link.href = image ;
    link.download = tableNumber+".png";
    link.click();
  }

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">

        <div className="flex items-center gap-2 mb-6">
          <QrCode size={18} className="text-gray-900" />
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Table QR Code</h3>
        </div>

        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center relative group overflow-hidden">

          <div ref={qrRef} className="bg-white flex flex-col font-bold items-center text-2xl p-10">
            <h2 className='py-5 '>{tableNumber}</h2>
            <QRCodeCanvas value={qrValue} size={200} />
          </div>
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={downloadQr} className="bg-white text-black p-3 rounded-xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <Download size={20} />
              </button>
          </div>

        </div>

      </div>
    </>
  )
}