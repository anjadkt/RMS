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
  const [error,setError] = useState({});
  const [loading,setLoading] = useState(false);

  const handleChange = (e) =>{
    setError(pre => ({...pre , [e.target.name] : null}));
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
      setForm(pre => ({...pre , photo : url}));
      setError(pre => ({...pre, photo: null})); // Clear photo error on success
    }catch(err){
      console.log(err.message);
    }finally{
      setLoading(false);
    }
  }

  const validate = ()=>{
    const errorObj = {}
    if(!form.name?.trim()){
        errorObj.name = "Name is required!"
    }
    if(!form.photo){
      errorObj.photo = "Photo required!"
    }
    if(!form.email?.trim().includes("@") || !form.email.trim().length){
      errorObj.email = "Valid email required!"
    }
    // Fixed: logic used errorObj instead of error state directly
    if(!form.number?.trim().length || form.number?.trim().length !== 10){
      errorObj.number = "Enter 10 digit number!"
    }
    if(!form.address?.trim().length){
      errorObj.address = "Address required!"
    }

    setError(errorObj);
    // Fixed: Checking length of keys
    return Object.keys(errorObj).length === 0;
  }

  const createStaffs = async () => {
    if(!validate()) return;

    try{
      setLoading(true);
      await api.post('/staff/admin',{...form, details : {
        address : form.address , 
        number : form.number,
        photo : form.photo
      }});
      setShow(false);
      fetchUsers();
    }catch(err){
      const errorObj = {}
      switch(err.status){
        case 400 :
          errorObj.name = "required!"
          break ;
        case 409 :
          errorObj.email = "email / user already Exist!"
          break ;
      }
      setError(errorObj);
    }finally{
      setLoading(false);
    }
  }

  const ErrorLabel = ({ message }) => (
    message ? <span className="absolute right-0 top-0 text-[10px] font-bold text-red-500 uppercase tracking-tight">
      {message}
    </span> : null
  );

  return(
     <div className="fixed inset-0 py-20 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-auto">
        <div className="w-full max-w-md mt-10 overflow-hidden rounded-2xl bg-white shadow-2xl">
          
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="text-xl font-semibold text-gray-800">Add New Staff Member</h3>
          </div>

          <form onSubmit={(e)=>{
            e.preventDefault();
            createStaffs();
          }} className="p-6 space-y-4">
            
            <div className="flex items-center space-x-4 relative">
              <div className="h-16 w-16 flex items-center justify-center flex-shrink-0 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-200">
                {
                  loading ? (
                     <span className="inline-block h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) :
                  form.photo ? (
                    <img src={form.photo} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                }
              </div>
              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                <input onChange={handleFile} type="file" className="mt-1 block w-full text-xs text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100" />
                <ErrorLabel message={error.photo} />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input name="name" onChange={handleChange} type="text" placeholder="John Doe" className={`mt-1 block w-full rounded-lg border ${error.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`} />
              <ErrorLabel message={error.name} />
            </div>

             <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" onChange={handleChange} type="text" placeholder="jsa@gmail.com" className={`mt-1 block w-full rounded-lg border ${error.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`} />
              <ErrorLabel message={error.email} />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="waiter">waiter</option>
                <option value="cook">cook</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input name="number" onChange={handleChange} type="tel" placeholder="10 Digit Number" className={`mt-1 block w-full rounded-lg border ${error.number ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`} />
              <ErrorLabel message={error.number} />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea name="address" onChange={handleChange} rows="2" placeholder="123 Main St, City" className={`mt-1 block w-full rounded-lg border ${error.address ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}></textarea>
              <ErrorLabel message={error.address} />
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3 pt-2">
              <button onClick={()=>setShow(false)} type="button" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Cancel</button>
              <button type="submit" disabled={loading} className="rounded-lg bg-black/90 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all cursor-pointer hover:bg-black disabled:bg-gray-400">
                {loading ? "Processing..." : "Create Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}