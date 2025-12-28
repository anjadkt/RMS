import {useNavigate} from 'react-router-dom'

export default function SearchResultItem({ data }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={()=>navigate(`/items/${data.category}`)}
      className="
        flex items-center gap-3 p-2
        rounded-lg cursor-pointer
        hover:bg-gray-100 active:bg-gray-200
        transition-colors
      "
    >
      <img
        src={data.image}
        alt={data.name}
        className="h-12 w-12 object-cover rounded-md"
      />

      <p className="text-sm font-medium text-gray-800 truncate">
        {data.name}
      </p>
    </div>
  );
}
