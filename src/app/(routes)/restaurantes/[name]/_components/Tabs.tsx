import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Business } from "@/types"
import MenuSection from "./MenuSection"
import ReviewsSection from "./ReviewsSection"
import AboutUs from "./AboutUs"


const TabsComponent = ({ restaurante }: {
    restaurante: Business | null
}) => {

    return (
        <Tabs defaultValue="category" className="w-full mt-4">
            <TabsList>
                <TabsTrigger value="category">Category</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="category">
                <MenuSection restaurante={restaurante} />
            </TabsContent>
            <TabsContent value="about">
                <AboutUs restaurante={restaurante} />
            </TabsContent>
            <TabsContent value="reviews">
                <ReviewsSection restaurante={restaurante} />
            </TabsContent>
        </Tabs>

    )
}

export default TabsComponent
