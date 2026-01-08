import { useNavigate } from "react-router-dom";

export default function Category() {
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

  return (
    <div className="mt-4 mb-12 py-4 flex gap-6 overflow-x-auto scrollbar-hide px-4 lg:px-20">
      {categories.map((cat, i) => (
        <div 
          onClick={() => navigate(`/items/${cat.name}`)}
          key={i}
          className="group flex flex-col items-center gap-3 min-w-[90px] cursor-pointer"
        >
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center shadow-sm group-hover:border-[#cd0045] group-hover:shadow-rose-100 transition-all">
            <img className="h-10 lg:h-12 object-contain group-hover:scale-110 transition-transform" src={cat.img} alt={cat.name} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest text-center ${cat.name === "Show All" ? "text-rose-600" : "text-slate-500 group-hover:text-slate-900"}`}>
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  );
}