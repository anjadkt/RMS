import Header from "../components/Header";
import api from "../services/axios";
import {useState} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { setSearch } from "../app/features/product/productSlice";

export default function Menu (){
  const [loading,setLoading] = useState(false);
  const {searchProduct} = useSelector(state => state.product);
  const dispatch = useDispatch() ;

  async function searchItem(e){
    if(!e.target.value)return dispatch(setSearch([]));
    try{
      setLoading(true);
      const {data} = await api.get(`/items?q=${e.target.value}`);
      dispatch(setSearch(data));
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }



  return(
    <>
     <Header />
     <div>
       <img src="" alt="offer img" />

       <input onChange={searchItem} type="text" placeholder="search Anything..." />

       <div>
        {loading? "Loading..." : (

          searchProduct.map(v =>(
            <div>
              <img src={v.img} alt={v.category} />
              <div>{v.name}</div>
          </div>
          ))
        )}
       </div>

     </div>

     <div>
      
     </div>

     <div>
      <div>All Menu</div>
     </div>


    </>
  )
}