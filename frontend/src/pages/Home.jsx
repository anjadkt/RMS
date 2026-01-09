import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import api from '../services/axios.js';
import DotLoader from "../components/DotLoader.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from 'react-router-dom';
import { Autoplay, Pagination } from "swiper/modules";
import BestSeller from '../components/BestSeller.jsx';
import Category from '../components/Category.jsx';
import Footer from '../components/Footer.jsx';
import Nav from '../components/Nav.jsx';
import Cart from '../components/Cart.jsx';
import "swiper/css";
import "swiper/css/pagination";
import { PlayCircle, ArrowRight } from 'lucide-react';
import {useSelector} from 'react-redux'


export default function Home() {
  const {loading,specialItems , settings , bestSelling , } = useSelector(state => state.website);

  const navigate = useNavigate();

  const trust = [
    { text: "Freshly Cooked", img: "/icons/fresh.png" },
    { text: "4.5+ Rating", img: "/icons/rating.png" },
    { text: "Fast Delivery", img: "/icons/fast.png" },
    { text: "100k+ Served", img: "/icons/serve.png" },
    { text: "Since 1930", img: "/icons/rating.png" },
    { text: "Hygiene First", img: "/icons/fresh.png" }
  ];

  if (loading) return <DotLoader />;

  return (
    <>
      <Header />
      <main className='bg-[#FDFEFF] mb-20 mt-10 overflow-hidden'>
        
        {/* Hero Section */}
        <section className="px-4 py-8 lg:px-20 lg:py-16 flex flex-col lg:flex-row-reverse items-center gap-12">
          <div className="w-full lg:w-1/2">
            <Swiper 
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              className="rounded-[32px] overflow-hidden shadow-2xl shadow-rose-100"
            >
              {
                settings?.offers?.map((offer, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-[280px] lg:h-[400px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#2D2D2D] to-[#1a1a1a] flex items-center shadow-2xl group border border-gray-800">

                    <div className="relative z-10 w-full px-8 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-8">
                      
                      {/* Text Section */}
                      <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 max-w-md">
                        <span className="bg-[#cd0045] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
                          Limited Time Offer
                        </span>
                        <h2 className="text-2xl lg:text-3xl font-black text-white leading-[0.9] uppercase tracking-tighter font-[REM]">
                          {offer.title || "Taste the Premium"}
                        </h2>
                        <p className="text-gray-400 text-sm lg:text-base font-medium max-w-[280px] lg:max-w-xs">
                          Experience the finest delicacies crafted by our master chefs.
                        </p>
                        
                        <button 
                          onClick={() => navigate(`/items/${offer.product.category}`)}
                          className="mt-4 bg-white text-black hover:bg-[#cd0045] hover:text-white px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                        >
                          Order Now —&gt;
                        </button>
                      </div>

                      {/* 3. Hero Product Image */}
                      <div className="relative lg:block">
                        {/* Glow Effect behind product */}
                        <div className="absolute inset-0 bg-[#cd0045]/20 blur-[60px] rounded-full"></div>
                        
                        <img
                          src={offer.product.image}
                          alt={offer.product.name}
                          className="relative h-44 lg:h-72 w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Price Badge on Product */}
                        <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-2xl border border-gray-100 transform -rotate-12 group-hover:rotate-0 transition-transform">
                          <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Price</p>
                          <p className="text-lg font-black text-gray-900 tracking-tighter">₹{offer.product.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="lg:w-1/2 text-center lg:text-left space-y-6">
            <span className="inline-block px-4 py-1.5 bg-rose-50 text-[#cd0045] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              Premium Food Delivery
            </span>
            <h1 className="text-4xl lg:text-7xl font-black leading-[1.1] text-slate-900">
              The Smarter Way to <span className="text-[#cd0045]">Order Food</span>
            </h1>
            <p className="text-slate-500 text-base lg:text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              Skip the queues. Enjoy authentic flavors delivered to your table or doorstep with lightning speed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto group flex items-center justify-center gap-2 px-6 py-4 bg-[#cd0045] text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-rose-200 active:scale-95"
              >
                Start Ordering 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white sm:bg-transparent border border-slate-100 sm:border-none rounded-2xl sm:rounded-none text-slate-900 font-black text-[10px] sm:text-xs uppercase tracking-widest hover:text-[#cd0045] transition-colors active:scale-95">
                <PlayCircle size={20} className="text-[#cd0045]" /> 
                How it works
              </button>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="px-4 lg:px-20 mb-6 flex items-center justify-between">
          <h2 className="text-xl lg:text-3xl font-black text-slate-900 uppercase tracking-tighter">Food Categories</h2>
          <div className="h-[2px] flex-grow mx-6 bg-slate-100 hidden sm:block"></div>
        </div>
        <Category />

        {/* Dynamic Horizontal Lists */}
        {[
          { title: "Best Selling", data: bestSelling },
          { title: "Today's Special", data: specialItems }
        ].map((section, idx) => (
          <div key={idx} className="mb-12">
            <div className="px-4 lg:px-20 mb-8 flex items-center justify-between">
              <h2 className="text-xl lg:text-3xl font-black text-slate-900 uppercase tracking-tighter">{section.title}</h2>
              <div className="h-[2px] flex-grow mx-6 bg-slate-100 hidden sm:block"></div>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 lg:px-20 pb-4">
              {section.data?.map((item, i) => (
                <BestSeller key={i} data={item} />
              ))}
            </div>
          </div>
        ))}

        {/* Trust Section */}
        <div className="px-4 lg:px-20 py-20 bg-slate-50">
          <h1 className="text-2xl lg:text-4xl font-black text-center text-slate-900 mb-12">Why People Love Us</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trust.map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
                <div className="w-12 h-12 mb-4 bg-rose-50 rounded-2xl flex items-center justify-center group-hover:bg-[#cd0045] transition-colors">
                  <img className="h-6 object-contain group-hover:invert transition-all" src={v.img} alt="" />
                </div>
                <div className="text-xs font-black text-slate-800 uppercase tracking-widest leading-tight">{v.text}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Cart />
      <Nav />
      <Footer />
    </>
  );
}