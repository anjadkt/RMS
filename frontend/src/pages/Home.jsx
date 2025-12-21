import { useEffect,useState } from 'react'
import Header from '../components/Header.jsx'
import api from '../services/axios.js'

export default function Home (){
  const [loading,setLoading] = useState(false);
  const [data,setData] = useState({
    special : [],
    settings : {},
    best : []
  });
  const {special,settings,best} = data ;

  console.log(settings);

  useEffect(()=>{
    async function fetchWebData() {
      try{
        setLoading(true);
        const {data} = await api.get('/resto?settings=true&best=true&special=true');
        setData(data);
      }catch(error){

      }finally{
        setLoading(false)
      }
    }
    fetchWebData();
  },[])

  if(loading)return <h1>Loading....</h1>
  return(
    <>
     <Header/>
     <main>
      <div>
        <div>
          <h1>
            The Smarter Way to <br />Order Food at <br />Restaurants
          </h1>
          <p>No waiting, no confusion <br /> just smooth ordering and quick service.</p>
          <div>
            <button>Start Ordering</button>
            <button>How to Order?</button>
          </div>
        </div>
        <div>
          {/* <img src={settings.offers?.[0]} alt="" /> */}
        </div>
      </div>
     </main>
    </>
  )
}