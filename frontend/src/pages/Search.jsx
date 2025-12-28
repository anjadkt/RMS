import SearchComp from "../components/SerachComp";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/axios";
import SearchResultItem from "../components/SearchResult";

export default function Search(){

  const categories = [
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660774/biriyaniCat_vppbxo.png",
      name : "Biryani"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660775/dessert_q9bhyf.png",
      name : "Desserts"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660774/pizzaCat_lj272b.png",
      name : "Pizza"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660774/burger_bzpl8t.png",
      name : "Burgers"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766638899/chickenkuruma_ngvbsn.png",
      name : "Curry"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660782/shakeCat_x0bsh7.png",
      name : "Beverages"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660789/friedrice_zkfoim.png" , 
      name : "fried rice"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660783/falooda_dm9o1h.png" , 
      name : "falooda"
    },
      {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660783/sandwitch_erienl.png" , 
      name : "sand witch"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660783/fries_tvgb9a.png",
      name : "fries"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660782/shake_skc5np.png",
      name : "shake",
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766660773/rolls_qigugz.png",
      name : "roles"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766638901/porotta_vv5sne.png",
      name : "porotta"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766638902/appam_cuv6et.png",
      name : "breakfast"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766638899/chickenmandi_m00ahl.png",
      name : "mandi"
    },
    {
      img : "https://res.cloudinary.com/dcsmtagf7/image/upload/v1766638898/friedchiken_cjxv3n.png",
      name : "chicken"
    }
  ]

  const [search,setSearch] = useState([]);

  async function searchItem(e){
    if(!e.target.value)return setSearch([]);
    try{
      const {data} = await api.get(`/items?q=${e.target.value}`);
      setSearch(data);
    }catch(error){
      console.log(error.message);
    }
  }

  const navigate = useNavigate();

  return(
    <>
     <div className="fixed top-0 left-0 right-0 flex items-center justify-center gap-2 p-2 bg-[#f7f7f7]">
      <img className="h-3 opacity-60" src="/icons/leftArrow.png" alt="arrow" onClick={()=>navigate('/')} />
      <SearchComp search={searchItem} />
     </div>
     <div className="mt-14 px-2">
      <div className="text-xs font-[REM] text-gray-400">WHAT'S ON YOUR MIND?</div>
      <div>
        {
          (search && search.length > 0) ? search.map(v => (<SearchResultItem data={v} />)) :
          (
            <div className="mt-0 mb-4 py-5 flex flex-wrap justify-center gap-x-6 gap-y-4 px-2">
            {categories.map((category, i) => (
              <div 
                onClick={()=>navigate(`/items/${category.name}`)}
                key={i}
                className="min-w-[120px] flex flex-col items-center justify-center
                          rounded-xl shadow-sm bg-white
                          px-2 py-3 cursor-pointer
                          hover:shadow-md transition"
              >
                <img
                  className="h-10 mb-2 object-contain"
                  src={category.img}
                  alt={category.name}
                />
                <div className={
                  `font-semibold text-sm ${category.name === "Show All" ? "text-red-500" : "text-gray-800"}  text-center`
                }
                
                >
                  {category.name}
                </div>
              </div>
            ))}
            
            </div>
          )
        }
      </div>
     </div>
    </>
  )
}