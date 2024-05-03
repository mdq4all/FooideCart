"use client"

import { CartUpdateContext, CartUpdateContextType } from "@/app/_context/cartUpdateContext"
import GlobalApi from "@/app/_utils/GlobalApi"
import { Input } from "@/components/ui/input"
import { Cart, Order } from "@/types"
import { useUser } from "@clerk/nextjs"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"

type ApiResponse = {
  userCarts: Cart[]
}

type ApiOrderResponse = {
  createOrder: {
    id: string
  }
}

const CkeckoutPage = () => {

  const params = useSearchParams()
  const { user, isSignedIn, isLoaded } = useUser()
  const [cart, setCart] = useState<Cart[] | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryAmount, setDeliveryAmount] = useState(5);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const { updateCart, setUpdateCart } = useContext<CartUpdateContextType>(CartUpdateContext)
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zip: '',
    address: '',
  });

  useEffect(() => {
    user && getUserCarts()
  }, [user, updateCart]);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in')
    }
  }, [isSignedIn]);

  const addToOrder = async () => {

    const dataOrder: Order = {
      email: user?.primaryEmailAddress?.emailAddress || '',
      orderAmount: total,
      restauranteName: params.get('restaurante') || '',
      userName: user?.fullName || '',
      address: formData.address,
      zipCode: formData.zip,
      phoneNumber: formData.phone
    }
    GlobalApi.createOrder(dataOrder).then((res) => {
      const apiResponse = res as ApiOrderResponse;
      const resultId = apiResponse.createOrder.id

      if (resultId) {
        cart?.forEach((item) => {
          GlobalApi.updateOrder(item.productName, item.price, resultId).then((res) => {
            GlobalApi.emptyUserCart(dataOrder.email).then((res) => {
              if (res) {
                toast.success('Order added')
                setUpdateCart(!updateCart)
                sendEmail()
                router.replace('/confirmation')
              }
            }).catch(error => {
              toast.error('Error empty cart')
            })
          })
        })
      }
    }).catch(error => {
      toast.error('Error adding order')
    })
  }

  const getUserCarts = () => {
    if (user?.primaryEmailAddress) {
      GlobalApi.getUserCart(user?.primaryEmailAddress?.emailAddress).then(res => {
        const apiResponse = res as ApiResponse;
        setCart(apiResponse.userCarts)
        calculateTotalAmount(apiResponse.userCarts)
      })
    }
  }

  const calculateTotalAmount = (cart_: Cart[]) => {
    let total = 0
    if (cart_.length > 0) {
      cart_?.forEach(item => {
        total += item.price
      })
      setSubtotal(total)
      setTax(total * 0.09)
      setTotal(total + total * 0.09 + deliveryAmount)
    }
  }

  const updateFormData = (target: HTMLInputElement) => {
    const { name, value } = target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendEmail = async () => {
    try {
      const res = await fetch('/api/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: user?.primaryEmailAddress?.emailAddress })
      })
      if (!res.ok) {
        toast.error('Error sending email confirmation')
      }
    } catch (error) {
      toast.error('Error sending email confirmation')
    }
  }

  return (isSignedIn &&
    <div className="p-4">
      <h2 className="font-bold text-2xl my-5">Checkout</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
        <div className="col-span-2">
          <h2 className="text-3xl font-bold">Billing Details</h2>

          <div className="sm:px-10 mt-6">
            <div className="flex gap-4 mb-6">
              <div className="w-full">
                <Input
                  value={formData.name}
                  placeholder="Name"
                  name="name"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData(e.target)}
                />
              </div>
              <div className="w-full">
                <Input
                  value={formData.email}
                  placeholder="Email"
                  type="email"
                  name="email"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData(e.target)}
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="w-full">
                <Input
                  value={formData.phone}
                  placeholder="Phone"
                  name="phone"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData(e.target)} />
              </div>
              <div className="w-full">
                <Input
                  value={formData.zip}
                  placeholder="Zip"
                  name="zip"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData(e.target)} />
              </div>
            </div>
            <div className="mb-6">
              <Input
                value={formData.address}
                placeholder="Address"
                name="address"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData(e.target)} />
            </div>
            -          </div>

        </div>
        <div className="sm:px-6 ">
          <div className="border rounded-md">
            <h2 className="font-bold text-center bg-slate-300 p-2">Total Cart ({cart && cart.length})</h2>
            <div className="p-3">
              <div className="flex justify-between py-2">
                <h2 className="font-bold">Subtotal:</h2>
                <h2>$ {subtotal.toFixed(2)}</h2>
              </div>
              <hr />
              <div className="flex justify-between py-2">
                <h2>Delivery:</h2>
                <h2>$ {deliveryAmount}</h2>
              </div>
              <div className="flex justify-between py-2">
                <h2>Tax (9%):</h2>
                <h2>$ {tax.toFixed(2)}</h2>
              </div>
              <hr />
              <div className="flex justify-between py-2">
                <h2 className="font-bold">Total:</h2>
                <h2 className="font-bold text-lg">$ {total.toFixed(2)}</h2>
              </div>
              {total > 0 &&
                <PayPalButtons
                  disabled={!formData.name || !formData.email || !formData.phone || !formData.zip || !formData.address}
                  style={{ layout: "vertical" }}
                  onApprove={addToOrder}
                  createOrder={(data, action) => {
                    return action.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [
                        {
                          amount: {
                            value: total.toFixed(2),
                            currency_code: 'USD'
                          }
                        }
                      ]
                    })
                  }}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CkeckoutPage
