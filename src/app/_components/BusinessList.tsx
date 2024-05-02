"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import GlobalApi from "../_utils/GlobalApi";
import { Business } from "@/types";
import BusinessItem from "./BusinessItem";
import SkeletonBusinessList from "./SkeletonBusinessList";

type ApiResponse = {
    restaurantes: Business[]
}

const BusinessList = () => {
    const params = useSearchParams()
    const [category, setCategory] = useState<string>
        ('all');
    const [businessList, setBusinessList] = useState<Business[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (params) {
            const categoryParam = params.get('category');
            if (categoryParam !== null) {
                setCategory(categoryParam);
                getBusinessList(categoryParam);
            }
        }
    }, [params]);

    useEffect(() => {
        getBusinessList('all')
    }, []);

    const getBusinessList = (categorySearch: string | null) => {
        setIsLoading(true)
        GlobalApi.getBusiness(categorySearch).then((res) => {
            const apiResponse = res as ApiResponse;
            setBusinessList(apiResponse.restaurantes)
            setIsLoading(false)
        })
    }

    return ( 
        <div className="mt-10 px-4 md:px-10">
            <h2 className="text-xl font-bold">Popular <span className="capitalize text-primary">{category}</span> Restaurantes</h2>
            <h2 className="text-primary font-bold">{businessList?.length} results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                {!isLoading ? (businessList && businessList.map((restaurante) => (
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
    )
}

export default BusinessList
