import { useState , useEffect} from "react";
import api from "../services/axios";

export default function Footer() {
  const [settings,setSettings] = useState({});
  console.log(settings);
  useEffect(()=>{
      async function fetchWebData() {
        try{
          const {data} = await api.get('/resto?settings=true');
          setSettings(data.settings);
        }catch(error){
          console.log(error.message);
        }
      }
      fetchWebData();
    },[])
  return (
    <footer className="bg-[#0f0f0f] text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div >
              <img className="h-15" src={settings?.logo} alt="" />
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Paragon is dedicated to delivering authentic flavors, quality ingredients,
            and a dining experience that keeps people coming back.
            Every dish is crafted with care, consistency, and passion.
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">About Paragon</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            From carefully curated recipes to seamless order handling,
            Paragon focuses on taste, trust, and timely service.
            Whether dining in or ordering out, we believe great food
            should always feel special.
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>📍 {settings.contactInfo?.location}</p>
            <p>📞 +91 {settings.contactInfo?.phone}</p>
            <p>✉️ {settings.contactInfo?.email}</p>
            <p className="text-xs text-gray-500 mt-4">
              Available 7 days a week, 9 AM – 11 PM
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Paragon. All rights reserved.
      </div>
    </footer>
  );
}
