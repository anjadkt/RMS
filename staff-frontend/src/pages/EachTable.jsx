import { useParams } from "react-router-dom"

export default function EachTable(){
  const {table} = useParams()
  return (
    <>
     Table {table}
    </>
  )
}