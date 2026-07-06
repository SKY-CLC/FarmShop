import { useDispatch } from "react-redux"
import { loadsearch } from "../../store/reducers/searchSlice";


const SearchBar = () => {

    const dispatch = useDispatch();

  return (
     <div className="flex items-center gap-2 bg-[#EDEDED] w-[40%] h-10 rounded-3xl px-3">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /> </svg>
      <input onChange={(e) => {dispatch(loadsearch(e.target.value))} } className="border-0 outline-0 w-full" type="text" placeholder="Search Product" />
      </div>
  )
}

export default SearchBar