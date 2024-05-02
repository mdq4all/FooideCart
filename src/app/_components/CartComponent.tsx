import { Button } from "@/components/ui/button"
import { Cart } from "@/types"
import { X } from "lucide-react"
import Image from "next/image"
import GlobalApi from "../_utils/GlobalApi"
import { toast } from "sonner"
import { CartUpdateContext, CartUpdateContextType } from "../_context/cartUpdateContext"
import { useContext } from "react"
import Link from "next/link"


const CartComponent = ({ cart }: {
  cart: Cart[] | null
}) => {

  const { updateCart, setUpdateCart } = useContext<CartUpdateContextType>(CartUpdateContext)

  const calculateCartAmount = () => {
    let total = 0
    cart?.forEach((item) => {
      total += item.price
    })
    return total.toFixed(2)
  }

  const removeItemFromCart = (
    id: string,
    slugResto: string
  ) => {

    toast('Deleting...')
    GlobalApi.disconnectRestoFromUserCartItem(id, slugResto).then((res) => {
      if (res) {
        GlobalApi.deleteItemFromCart(id).then((res) => {
          setUpdateCart(prevState => !prevState)
          toast.success('Delete item succesfull')
        })
      }
    }).catch((error) => {
      toast.error('Ha ocurrido un error')
    })
  }

  return cart && (
    <div>
      <h2 className="font-bold text-lg mb-2">My Order</h2>
      {cart.length > 0 ? (
        <div>
          <h2 className="capitalize font-bold">{cart.length > 0 && cart[0].restaurante.name}</h2>
          <div className="mt-1">
            <div className="flex flex-col gap-2">
              {cart && cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Image src={item.productImage}
                      width={40}
                      height={40}
                      alt={`${item.productName} icon`}
                      className="w-[40px] h-[40px] rounded-md object-cover" />
                    <h2 className="text-sm">{item.productName}</h2>
                  </div>
                  <h2 className="font-extrabold flex gap-2 items-center">
                    ${item.price}
                    <X color="#E26612" className="h-6 w-6 hover:cursor-pointer" onClick={() => removeItemFromCart(item.id, cart[0].restaurante.slug)} />
                  </h2>
                </div>
              ))}
              <Link href={`/checkout?restaurante=${cart[0]?.restaurante?.name}`}>
                <Button className="w-full">Checkout ${calculateCartAmount()}</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-20 bg-slate-200 rounded-md flex items-center justify-center">
          Your Cart is empty 😥
        </div>
      )}

    </div>
  )
}

export default CartComponent
