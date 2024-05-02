import GlobalApi from "@/app/_utils/GlobalApi"
import { UserOrder } from "@/types"
import { useUser } from "@clerk/nextjs"
import moment from "moment"
import { useEffect, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


type ApiOrders = {
  orders: UserOrder[]
}
const MyOrders = () => {

  const { user } = useUser()
  const [orders, setOrders] = useState<UserOrder[] | null>(null);

  const getOrders = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      GlobalApi.getUserOrders(user?.primaryEmailAddress?.emailAddress).then(res => {
        const ApiResponse = res as ApiOrders
        setOrders(ApiResponse.orders)
      })
    }
  }

  useEffect(() => {
    getOrders()
  }, [user]);

  return (
    <div>
      <h2 className="font-bold text-lg mb-2">My Orders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {orders?.map((order) => (
          <div key={order.id} className="border p-2 rounded-md">
            <h2 className="font-bold">{moment(order.createdAt).format('DD-MMM-YYYY')}</h2>
            <h2 className="capitalize flex justify-between text-sm">Restaurante: <span>{order.restauranteName}</span></h2>
            <h2 className="flex justify-between text-sm">Order Total Amount: <span>$ {order.orderAmount.toFixed(2)}</span></h2>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="w-full">
                <AccordionTrigger className="text-primary underline">View Details</AccordionTrigger>
                <AccordionContent>
                  {order.orderDetail.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <h2 className="text-sm">{item.name}:</h2>
                      <h2>${item.orderPrice}</h2>
                    </div>
                  ))}
                  <hr />
                  <h2 className="font-bold mt-2">Total Amount (Included taxes + delivery): <span>$ {order.orderAmount.toFixed(2)}</span></h2>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
