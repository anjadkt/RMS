import { useState } from "react"
import uploadImageToCloudinary from '../services/cloudnary.js'
import api from "../services/axios";

export default function AdminStaffModal({setShow,fetchUsers}){
  const [form,setForm] = useState({
    name : "",
    email : "",
    role : "waiter",
    number : "",
    address : "",
    photo : ""
  });
  const [loading,setLoading] = useState(false);

  const handleChange = (e) =>{
    setForm(pre =>(
      {...pre , [e.target.name] : e.target.value}
    ))
  }

  const handleFile = async (e) => {
    try{
      const file = e.target.files[0];
      if (!file) return;
      setLoading(true);
      const url = await uploadImageToCloudinary(file);
      setForm(pre =>{
        return (
          {...pre , photo : url}
        )
      })
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  const createStaffs = async () => {
    try{
      setLoading(true);
      const {data} = await api.post('/staff/admin',{...form,details : {
        address : form.address , 
        number : form.number,
        photo : form.photo
      }});
      setShow(false);
      fetchUsers();
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  return(
    <>
     <div class="fixed inset-0 py-20 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-auto">
        <div class="w-full max-w-md mt-10 overflow-hidden rounded-2xl bg-white shadow-2xl">
          
          <div class="border-b border-gray-100 px-6 py-4">
            <h3 class="text-xl font-semibold text-gray-800">Add New Staff Member</h3>
          </div>

          <form onSubmit={(e)=>{
            e.preventDefault();
            createStaffs();
          }} class="p-6 space-y-2">
            
            <div class="flex items-center space-x-4">
              <div class="h-16 w-16 flex items-center justify-center flex-shrink-0 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-200">
                {
                  loading ? (
                     <span className="inline-block h-5 w-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                  ) :
                  form.photo ? (
                    <img src={form.photo} alt="photo" />
                  ) : (
                    <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                }
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Profile Photo</label>
                <input onChange={handleFile} type="file" class="mt-1 block w-full text-xs text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Full Name</label>
              <input name="name" onChange={handleChange} type="text" placeholder="John Doe" class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

             <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" onChange={handleChange} type="text" placeholder="jsa@gmail.com" class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Role</label>
              <select name="role" onChange={handleChange} class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="">Select a role</option>
                <option value="waiter">waiter</option>
                <option value="cook">cook</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input name="number" onChange={handleChange} type="tel" placeholder="+91 000-000-0000" class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <textarea name="address" onChange={handleChange} rows="2" placeholder="123 Main St, City, Country" class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
            </div>

            <div class="mt-6 flex items-center justify-end space-x-3 pt-2">
              <button onClick={()=>setShow(false)} type="button" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Cancel</button>
              <button type="submit" class="rounded-lg bg-black/90 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all cursor-pointer hover:bg-black">
                {
                  loading ? (
                    <span className="inline-block h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create Staff"
                  )
                }
                
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}