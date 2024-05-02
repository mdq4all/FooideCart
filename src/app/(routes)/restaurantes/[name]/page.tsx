"use client"

import GlobalApi from "@/app/_utils/GlobalApi"
import { Business } from "@/types"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Intro from "./_components/Intro"
import TabsComponent from "./_components/Tabs"

type ApiResponse = {
    restaurante: Business
}

const BusinessDetailPage = () => {

    const params = useParams<{name: string}>()
    const [businessDetailPage, setBusinessDetailPage] = useState<Business | null>(null);

    useEffect(() => {
        getBusinessDetails()
    }, []);

    const getBusinessDetails = () => {
        GlobalApi.getRestaurante(params.name).then((res) => {
            const apiResponse = res as ApiResponse;
            setBusinessDetailPage(apiResponse.restaurante)
        })
    }

    return (
        <div className="px-4 lg:px-14 xl:px-32 mt-4 sm:mt-10">
          <Intro restaurante={businessDetailPage} />
          <TabsComponent restaurante={businessDetailPage} />
        </div>
    )
}

export default BusinessDetailPage
