"use client"

import { useEffect, useRef, useState } from "react"
import GlobalApi from "../_utils/GlobalApi"
import { Category } from "@/types";
import Image from "next/image";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type ApiResponse = {
    categories: Category[]
}

const CategoryList = () => {

    const listRef = useRef<HTMLDivElement>(null)
    const [categoryList, setCategoryList] = useState<Category[] | null>(null);
    const params = useSearchParams()
    const [selectedCategory, setSelectedCategory] = useState<string | null>('all');

    useEffect(() => {
        setSelectedCategory(params.get('category'))
    }, [params]);

    useEffect(() => {
        getCategoryList()
        setSelectedCategory('all')
    }, []);

    const getCategoryList = () => {
        GlobalApi.getCategory().then((res) => {
            const apiResponse = res as ApiResponse;
            if (apiResponse && Array.isArray(apiResponse.categories)) {
                setCategoryList(apiResponse.categories)
            }
        })
    }

    const scrollRightHandler = () => {
        if (listRef.current) {
            listRef.current.scrollBy({
                left: 200,
                behavior: 'smooth'
            })
        }
    }
    const scrollLeftHandler = () => {
        if (listRef.current) {
            listRef.current.scrollBy({
                left: -200,
                behavior: 'smooth'
            })
        }
    }

    return (categoryList ?
        (<div className="relative mt-10 px-4 md:px-10">
            <div ref={listRef} className="flex gap-3 md:gap-6 overflow-auto px-8 scrollbar-hide">
                {categoryList && categoryList.map((category) => (
                    <Link
                        href={`?category=${category.slug}`}
                        key={category.id}
                        className={`flex flex-col items-center py-2 md:px-8 rounded-lg bg-orange-300 border border-primary min-w-28 hover:bg-primary cursor-pointer group shadow-lg ${selectedCategory === category.slug && 'bg-primary border border-secondary'}`}>
                        <Image
                            src={category.icon.url}
                            alt={category.name}
                            width={40}
                            height={40}
                            className="h-8 w-8 md:h-12 md:w-12 group-hover:scale-110 duration-200" />
                        <h2 className="text-sm md:text-lg text-white font-bold text-nowrap group-hover:text-orange-300 capitalize">{category.name}</h2>
                    </Link>
                ))}
            </div>

            <ArrowLeftCircle
                size={35}
                className="absolute left-6 top-4 md:top-8 bg-gray-500 text-white rounded-full cursor-pointer hover:scale-105"
                onClick={() => scrollLeftHandler()} />

            <ArrowRightCircle
                size={35}
                className="absolute right-6 top-4 md:top-8  bg-gray-500 text-white rounded-full cursor-pointer hover:scale-105"
                onClick={() => scrollRightHandler()} />
        </div>) : (
            <div className="flex gap-4 px-8 mt-6 md:justify-center overflow-auto scrollbar-hide">
                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <div key={item}
                        className="bg-slate-400 w-28 h-20 min-w-28 animate-pulse rounded-lg"
                    ></div>
                ))}
            </div>
        )
    )
}

export default CategoryList
