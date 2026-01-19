import {useState} from 'react'

export const useConfirm = ()=>{
  const [config,setConfig] = useState({
    isOpen : false,
    title : "",
    message : "",
    onConfirm : ()=>{}
  })

  const ask = (title,message,onConfirm) => {
    setConfig({
      isOpen : true,
      title,
      message,
      onConfirm : ()=>{
        onConfirm();
        close();
      }
    })
  }

  const close = ()=>{
    setConfig(pre =>({...pre , isOpen : false}));
  }

  return {ask , close , config}
}