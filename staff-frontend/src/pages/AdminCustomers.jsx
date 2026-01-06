import AdminHeader from "../components/AdminHeader";
import { Search } from "lucide-react";

export default function AdminCustomers(){
  return (
    <>
     <AdminHeader/>
     <main className="pt-24 pb-10 px-6 ml-24 bg-gray-50/50 min-h-screen" >
      <div className="flex justify-between items-end gap-6 mb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Customers</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder='Search By Number...' 
              className="w-full text-gray-600 font-medium bg-white border border-gray-200 py-2.5 pl-10 pr-6 rounded-xl outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
     </main>
    </>
  )
}