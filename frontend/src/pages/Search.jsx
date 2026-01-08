import SearchComp from "../components/SerachComp";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/axios";
import SearchResultItem from "../components/SearchResult";

export default function Search() {
  const categories = [
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660774/biriyaniCat_vppbxo.png", name: "Biryani" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660775/dessert_q9bhyf.png", name: "Desserts" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660774/pizzaCat_lj272b.png", name: "Pizza" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660774/burger_bzpl8t.png", name: "Burgers" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766638899/chickenkuruma_ngvbsn.png", name: "Curry" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660782/shakeCat_x0bsh7.png", name: "Beverages" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660789/friedrice_zkfoim.png", name: "Fried Rice" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660783/falooda_dm9o1h.png", name: "Falooda" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660783/sandwitch_erienl.png", name: "Sandwich" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660783/fries_tvgb9a.png", name: "Fries" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660782/shake_skc5np.png", name: "Shakes" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660773/rolls_qigugz.png", name: "Rolls" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766638901/porotta_vv5sne.png", name: "Porotta" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766638902/appam_cuv6et.png", name: "Breakfast" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766638899/chickenmandi_m00ahl.png", name: "Mandi" },
    { img: "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766638898/friedchiken_cjxv3n.png", name: "Chicken" }
  ];

  const [search, setSearch] = useState([]);
  const navigate = useNavigate();

  async function searchItem(e) {
    if (!e.target.value) return setSearch([]);
    try {
      const { data } = await api.get(`/items?q=${e.target.value}`);
      setSearch(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* --- STICKY TOP SEARCH HEADER --- */}
      <div className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <img className="h-4 opacity-70 rotate-180" src="/icons/leftArrow.png" alt="back" />
        </button>
        <div className="flex-grow">
          <SearchComp search={searchItem} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-6 pb-20">
        {search && search.length > 0 ? (
          /* --- SEARCH RESULTS --- */
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Search Results</p>
            {search.map((v) => (
              <SearchResultItem key={v._id} data={v} />
            ))}
          </div>
        ) : (
          /* --- POPULAR CATEGORIES GRID --- */
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm lg:text-base font-black text-gray-800 tracking-tight font-[REM]">
                WHAT'S ON YOUR MIND?
              </h2>
              <div className="h-[1px] flex-grow bg-gray-100 ml-4"></div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-4">
              {categories.map((category, i) => (
                <div
                  onClick={() => navigate(`/items/${category.name}`)}
                  key={i}
                  className="group flex flex-col items-center cursor-pointer transition-all active:scale-95"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors shadow-sm overflow-hidden">
                    <img
                      className="h-14 w-14 sm:h-16 sm:w-16 object-contain transform group-hover:scale-110 transition-transform duration-300"
                      src={category.img}
                      alt={category.name}
                    />
                  </div>
                  <span className="text-[11px] lg:text-xs font-black text-gray-700 uppercase tracking-tighter text-center group-hover:text-[#cd0045]">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}