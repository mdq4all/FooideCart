import { calculateRating } from "@/app/_utils/calculateAverage"
import { Business } from "@/types"
import { MapPinIcon } from "lucide-react"
import Image from "next/image"

const Intro = ({ restaurante }: {
    restaurante: Business | null
}) => {

    return (
        <div>
            {restaurante ? (<div>
                <Image src={restaurante?.banner.url} 
                    width={1000} 
                    height={300} 
                    alt="restaurante banner"
                    className="w-full h-[150px] sm:h-[200px] md:h-[250px] object-cover rounded-xl"
                    priority />
            </div>) : (
                <div className="w-full h-[220px] animate-pulse bg-slate-400 rounded-lg"></div>
            )}
            <h2 className="my-4 text-2xl md:text-4xl font-bold px-4 sm:px-0 capitalize">{restaurante?.name}</h2>
            <div className="flex items-center gap-4">
                <Image src={'/estrella.png'} width={20} height={20} alt="star icon" />
                <label className="text-gray-500">{restaurante && calculateRating(restaurante?.reviews)} ({restaurante && restaurante.reviews.length})</label>
            </div>
            <h2 className="flex gap-4 items-center text-gray-500 mt-2"><MapPinIcon /> {restaurante?.address}</h2>
        </div>
    )
}

export default Intro
