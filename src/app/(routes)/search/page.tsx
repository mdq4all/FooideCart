"use client"

import BusinessItem from "@/app/_components/BusinessItem"
import SkeletonBusinessList from "@/app/_components/SkeletonBusinessList"
import GlobalApi from "@/app/_utils/GlobalApi"
import { Business } from "@/types"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type ApiResponse = {
  restaurantes:Business[]
}
const SearchPage = () => {

    const params = useSearchParams()
    const [searchReasults, setSearchReasults] = useState<Business[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
      searchResto()
    }, [params]);

    const searchResto = () => {
      if (params) {
        const queryParams = params.get('query')
        if (queryParams !== null){
          GlobalApi.searchBusiness(queryParams).then((res) => {
            const searchResponse = res as ApiResponse
            setSearchReasults(searchResponse.restaurantes)
          })
        }
      }
    }
  return (
    <div>
       <div className="mt-10 px-4 md:px-10">
            <h2 className="text-xl font-bold">Searched Restaurantes</h2>
            <h2 className="text-primary font-bold">{searchReasults?.length} results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                {!isLoading ? (searchReasults && searchReasults.map((restaurante) => (
                    <BusinessItem
                        key={restaurante.id}
                        restaurante={restaurante} />
                ))) : (
                    [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <SkeletonBusinessList key={item} />
                    ))
                )}
            </div>
        </div>
    </div>
  )
}

export default SearchPage
