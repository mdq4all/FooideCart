import { CartUpdateContext, CartUpdateContextType } from "@/app/_context/cartUpdateContext"
import GlobalApi from "@/app/_utils/GlobalApi"
import { Button } from "@/components/ui/button"
import { Business, MenuItem, UserCart } from "@/types"
import { useUser } from "@clerk/nextjs"
import { SquarePlus } from "lucide-react"
import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"



const MenuSection = ({ restaurante }: {
  restaurante: Business | null
}) => {

  const [menuItemList, setMenuItemList] = useState<MenuItem | null>(null);

  const { user } = useUser()

  const { updateCart, setUpdateCart } = useContext<CartUpdateContextType>(CartUpdateContext)

  const filterMenu = (category: string | null) => {
    const result = restaurante?.menu.filter((item) => item.category === category)
    if (result) {
      setMenuItemList(result[0])
    }
  }

  useEffect(() => {
    restaurante && restaurante.menu.length > 0 && filterMenu(restaurante?.menu[0].category)
  }, [restaurante]);


  function addToCartHandler(item: {
    description: string;
    id: string;
    name: string;
    price: number;
    productImage: [{ url: string }],
  }): void {

    toast('Addind to Cart...')

    if (user?.primaryEmailAddress && typeof user.primaryEmailAddress.emailAddress === "string" && restaurante) {

      const data: UserCart = {
        email: user?.primaryEmailAddress?.emailAddress,
        productName: item.name,
        price: item.price,
        productDescription: item.description,
        productImage: item.productImage[0].url,
        restauranteSlug: restaurante.slug
      }
      GlobalApi.addToCart(data).then(res => {
        setUpdateCart((prevUpdateCart: boolean) => !prevUpdateCart)
        toast.success(`Added to Cart ${item.name}`)
      }, (error) => {
        toast.error('Error adding to Cart')
      })
    }
  }

  return (
    <div>
      <div className="grid grid-cols-4 mt-2">
        <div className="hidden md:flex flex-col gap-2">
          {restaurante?.menu.map((item) => (
            <Button
              key={item.id}
              variant='ghost'
              className="flex justify-start"
              onClick={() => filterMenu(item.category)}
            >
              {item.category}
            </Button>
          ))}
        </div>
        <div className="col-span-4 md:col-span-3 px-2 pb-8">
          <h2 className="font-bold text-xl mb-2">{menuItemList?.category}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {menuItemList?.menuItem && menuItemList?.menuItem.map((item) => (
              <div key={item.id} className="flex gap-4 p-2 border rounded-lg hover:border-primary hover:bg-orange-50 cursor-pointer">
                <Image
                  src={item.productImage[0].url}
                  alt="image menu"
                  width={120}
                  height={120}
                  className="w-[120px] h-auto object-cover rounded-md" />
                <div className="flex flex-col gap-1">
                  <h2 className="font-bold capitalize">{item.name}</h2>
                  <h2>Price: $ {item.price}</h2>
                  <h2 className="text-gray-500 text-sm line-clamp-2">{item.description}</h2>
                  <button>
                    <SquarePlus onClick={() => addToCartHandler(item)}
                      className="hover:scale-110 duration-150" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuSection
