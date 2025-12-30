import Nav from '../components/Nav.jsx'
import TableComp from '../components/tableComp.jsx'
import { useEffect,useState } from 'react'
import api from '../services/axios.js';

export default function Table (){
  const [tables,setTables] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    async function fetchTables() {
      try{
        setLoading(true);
        const {data} = await api.get('/waiter/table');
        setTables(data.tables);

      }catch(error){
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    }
    fetchTables();
  },[])
  return(
    <>
     <header className="py-3 lg:ml-42 xl:ml-42 text-center">
      <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 tracking-wide">
        Tables
        <span className="ml-2 text-gray-500 font-medium">
          ({tables.length})
        </span>
      </h1>
    </header>


     <Nav/>
     <main className='lg:ml-42 flex flex-wrap gap-2 items-center justify-center mt-2'>
      {
        loading ? (
          <span className="h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
        ) : tables.length < 1 ? (
          <div>Tables Not Found!</div>
        ) : (
          tables?.map(v => (
            <TableComp data={v} />
          ))
        )
      }
     </main>

    </>
  )
}