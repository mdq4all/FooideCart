import { Business } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { calculateRating } from "../_utils/calculateAverage"

const BusinessItem = ({ restaurante }: {
    restaurante: Business
}) => {

    return (
        <Link href={`/restaurantes/${restaurante.slug}`} className="p-2 hover:border hover:border-primary rounded-xl transition-all duration-200 ease-in-out hover:bg-orange-50 cursor-pointer">
            <Image src={restaurante.banner.url}
                width={400}
                height={130}
                alt={`${restaurante.name} banner`}
                className="w-full h-[150px] rounded-lg object-cover" />
            <h2 className="font-bold text-lg mt-2 capitalize">{restaurante.name}</h2>
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <Image src='/estrella.png' width={20} height={20} alt="star icon" />
                    <label className="text-gray-500 text-sm">
                        {restaurante.reviews.length > 0 ? calculateRating(restaurante.reviews) : 0}
                    </label>
                    <h2 className="text-gray-500 text-sm capitalize">{restaurante.restoType[0].replace(/_/g, ' ')}</h2>
                </div>
                <h2 className="text-primary capitalize">{restaurante.categories[0].name.replace(/_/g, ' ')}</h2>
            </div>
        </Link>
    )
}

export default BusinessItem
