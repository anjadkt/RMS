import { useNavigate } from "react-router-dom";

export default function Category (){
  const navigate = useNavigate();

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
    },
    {
      img : "/icons/serve.png",
      name : "Show All"
    }
  ]
  return(
    <>
      <div className="mt-0 mb-4 py-5 flex gap-2 overflow-x-auto scrollbar-hide px-2">
        {categories.map((category, i) => (
          <div 
            onClick={()=>navigate(`/items/${category.name}`)}
            key={i}
            className="
              min-w-[120px] flex flex-col items-center justify-center
              rounded-xl shadow-sm bg-white
              px-2 py-3 cursor-pointer
              hover:shadow-md transition
              lg:px-4 lg:py-6
            "
          >
            <img
              className="h-10 lg:h-12 mb-2 object-contain"
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
    </>
  )
}