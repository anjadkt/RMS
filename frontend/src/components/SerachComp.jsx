import {useNavigate} from 'react-router-dom'

export default function SearchComp({search}){
  const navigate = useNavigate();

  return(
    <div 
      onClick={() => navigate('/search')} 
      className="group relative w-full flex items-center transition-all duration-300"
    >
      {/* Search Icon */}
      <div className="absolute left-5 z-10">
        <img
          src="/icons/searchfood.png"
          alt="search"
          className="h-5 w-5 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all"
        />
      </div>

      <input
        type="text"
        onChange={search}
        placeholder="What are you craving today?"
        className="w-full pl-14 pr-16 py-2 lg:py-3 rounded-2xl bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#cd0045]/20 focus:border-[#cd0045] transition-all"
      />

      {/* Mic Icon / Voice Search Wrapper */}
      <div className="absolute right-4 flex items-center gap-3">
        <div className="h-6 w-[1px] bg-gray-200"></div>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <img
            src="/icons/mic.png"
            alt="mic"
            className="h-5 w-5 opacity-50"
          />
        </button>
      </div>
    </div>
  )
}