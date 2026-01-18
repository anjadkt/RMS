import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {Html5Qrcode} from 'html5-qrcode'

const QrScanner = () => {
  const scannerRef = useRef(null);
  const navigate = useNavigate();


  useEffect(()=>{
    const scanner = new Html5Qrcode("qr-scanner");
    scannerRef.current = scanner;

    scanner.start(
      {facingMode : "environment"},
      {
        fps: 10,
        qrbox : 260
      },
      (decodedText) =>{
        ///cart?table=TBL-01
        const link = decodedText.split("?")[1];
        navigate(`/cart?${link}`);
        scanner.stop();
      }
    ).catch((error)=>{
      console.log(error.message);
      navigate('/cart');
    })

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  },[])



  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 text-sm animate-pulse">Initializing camera...</div>
      </div>

      {/* 2. SCANNING OVERLAY (The "Hole" in the middle) */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top Dark Section */}
        <div className="h-1/4 w-full bg-black/60 backdrop-blur-[2px] flex items-end justify-center pb-8">
            <div className="text-center">
                <h1 className="text-white text-xl font-semibold tracking-wide">Scan Table QR</h1>
                <p className="text-gray-300 text-sm mt-1">Position the code inside the frame</p>
            </div>
        </div>

        {/* Middle Section (Scanner Frame) */}
        <div className="flex-1 flex items-center justify-center bg-black/60">
          <div
            id="qr-scanner"
            className="w-[260px] h-[260px] overflow-hidden rounded-xl"
          />
        </div>

        {/* Bottom Dark Section */}
        <div className="h-1/3 w-full bg-black/60 backdrop-blur-[2px] flex flex-col items-center pt-10 gap-6">
            <button onClick={()=>navigate('/cart')} className="text-white/60 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors">
                Cancel
            </button>
        </div>
      </div>

    </div>
  );
};

export default QrScanner;