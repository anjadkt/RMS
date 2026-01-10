import Nav from '../components/Nav.jsx'
import TableComp from '../components/tableComp.jsx'
import { useEffect, useState } from 'react'
import api from '../services/axios.js';

export default function Table() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTables() {
      try {
        setLoading(true);
        const { data } = await api.get('/waiter/table');
        setTables(data.tables);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTables();
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 lg:left-54 px-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            All Tables
          </h1>
          <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold text-slate-500">
            {tables.length} Tables Total
          </div>
        </div>
      </header>

      <Nav />

      <main className='pt-24 pb-24 px-4 lg:ml-54 lg:pt-28 lg:px-8'>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tables.length < 1 ? (
          <div className="text-center py-20 text-slate-400 font-medium">
            Tables Not Found!
          </div>
        ) : (
          /* Grid layout for different screen sizes */
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-3 lg:gap-6 max-w-[1600px] mx-auto">
            {tables?.map(v => (
              <TableComp key={v._id} data={v} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}