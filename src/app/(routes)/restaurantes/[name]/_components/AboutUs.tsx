import { Business } from "@/types"

const AboutUs = ({ restaurante }: {
    restaurante: Business | null
}) => {
    return (
        <div className="flex justify-center mt-5">
            <div className="max-w-2xl border p-6 rounded-md shadow-xl">
                <h2 className="font-bold capitalize text-2xl mb-5">{restaurante?.name}</h2>
                <p className="text-slate-600">{restaurante?.aboutUs}</p>
            </div>
        </div>
    )
}

export default AboutUs
