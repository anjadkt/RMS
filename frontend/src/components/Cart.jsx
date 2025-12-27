import { useEffect, useState } from "react";
import api from "../services/axios.js";
import { useSelector } from "react-redux";

export default function Cart({isItems}) {
  const [cart, setCart] = useState([]);
  const { scroll } = useSelector((state) => state.website);

  useEffect(() => {
    async function fetchCart() {
      try {
        const { data } = await api.get("/user/cart");
        setCart([
          {
            _id : "694cca6180dbdd60cab3c6f4",
            name : "Chicken 65",
            price : 180,
            image :"https://res.cloudinary.com/dcsmtagf7/image/upload/v1766750404/pastaaa_ueh0p2.png",
            category : "Starters",
            rating : 3,
            isAvailable : true,
            isRemoved : false,
            isSpecial : true,
            isBest :false
          },
          {
            _id : "694cca6180dbdd60cab3c6f4",
            name : "Chicken 65",
            price : 180,
            image :"https://res.cloudinary.com/dcsmtagf7/image/upload/v1766750404/pastaaa_ueh0p2.png",
            category : "Starters",
            rating : 3,
            isAvailable : true,
            isRemoved : false,
            isSpecial : true,
            isBest :false
          },
          {
            _id : "694cca6180dbdd60cab3c6f4",
            name : "Chicken 65",
            price : 180,
            image :"https://res.cloudinary.com/dcsmtagf7/image/upload/v1766750404/pastaaa_ueh0p2.png",
            category : "Starters",
            rating : 3,
            isAvailable : true,
            isRemoved : false,
            isSpecial : true,
            isBest :false
          },
          {
            _id : "694cca6180dbdd60cab3c6f4",
            name : "Chicken 65",
            price : 180,
            image :"https://res.cloudinary.com/dcsmtagf7/image/upload/v1766750404/pastaaa_ueh0p2.png",
            category : "Starters",
            rating : 3,
            isAvailable : true,
            isRemoved : false,
            isSpecial : true,
            isBest :false
          },
          {
            _id : "694cca6180dbdd60cab3c6f4",
            name : "Chicken 65",
            price : 180,
            image :"https://res.cloudinary.com/dcsmtagf7/image/upload/v1766750404/pastaaa_ueh0p2.png",
            category : "Starters",
            rating : 3,
            isAvailable : true,
            isRemoved : false,
            isSpecial : true,
            isBest :false
          },
          {
            _id : "694cca6180dbdd60cab3c6f4",
            name : "Chicken 65",
            price : 180,
            image :"https://res.cloudinary.com/dcsmtagf7/image/upload/v1766750404/pastaaa_ueh0p2.png",
            category : "Starters",
            rating : 3,
            isAvailable : true,
            isRemoved : false,
            isSpecial : true,
            isBest :false
          }
        ]);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchCart();
  }, []);

  if (!cart.length) return null;

  return (
    <>
      <div
        className={`flex items-center justify-between px-4 w-[280px] fixed left-1/2 -translate-x-1/2 z-50
        transition-all duration-300
        overflow-hidden h-11
        bg-black shadow-xl rounded-2xl
        xl:bottom-3 lg:bottom-3 xl:py-6
        ${scroll > 100 || isItems ? "bottom-1" : "bottom-12"}`}
      >
        <div className="flex -space-x-2">
          {cart.slice(0, 4).map((v, i) => (
            <img
              key={i}
              src={v.image}
              alt={v.name}
              className="h-6 w-6 rounded-full border-2 border-white object-cover"
            />
          ))}
          {cart.length > 4 && (
            <div className="h-6 w-6 rounded-full bg-gray-200 text-xs font-semibold
            flex items-center justify-center">
              +{cart.length - 4}
            </div>
          )}
        </div>

        <div className="text-sm font-semibold text-white whitespace-nowrap">
          {cart.length} item{cart.length > 1 ? "s" : ""}
        </div>

        <div>
          <button
            className="bg-[#cd0045] text-white px-2 py-1 rounded-xl
            text-sm font-semibold hover:opacity-90 transition whitespace-nowrap"
          >
            View Cart
          </button>
        </div>
      </div>
    </>
  );
}
