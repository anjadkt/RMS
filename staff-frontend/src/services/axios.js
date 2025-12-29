import axios from 'axios'

const api = axios.create({
  baseURL : import.meta.env.VITE_API_BASE_URL,
  withCredentials : true
});

api.interceptors.response.use(res => res ,async err =>{
  const originalReq = err.config ;
  if(err.response?.status === 401 && !originalReq._retry){
    originalReq._retry = true ;
    try{
      await api.get("/auth/refresh");
      return api(originalReq);
    }catch(error){
      return Promise.reject(error);
    }
  }
   return Promise.reject(err);
})

export default api ;