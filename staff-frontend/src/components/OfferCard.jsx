   import {Star,Trash2,LinkIcon} from 'lucide-react'
   
   export default function OfferCard ({ removeOffer, data }) {

    return (
      <>
       <div className={`relative flex flex-col bg-white border ${data.isMain ? 'border-indigo-200 ring-2 ring-indigo-500/10' : 'border-gray-100'} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all h-[320px]`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${data.isMain ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {data.isMain ? <div className="flex items-center gap-1"><Star size={10} fill="currentColor"/> Main Offer</div> : "Normal Offer"}
            </span>
            <button onClick={()=>removeOffer({id : data._id , product : data.product._id})} className="text-gray-300 hover:text-rose-500 transition-colors cursor-pointer">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden bg-gray-50 border border-gray-50 mb-3">
            <img src={data.offer} alt={data.title} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-gray-900 truncate">{data.title}</h4>
            <div className="flex items-center gap-2 text-gray-400">
              <LinkIcon size={12} />
              <p className="text-[10px] font-bold uppercase truncate">Linked: {data.product?.name}</p>
            </div>
          </div>
        </div>
      
      </>
    )

   }

