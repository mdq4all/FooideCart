"use client"

import { Toaster } from "@/components/ui/sonner"
import Header from "./_components/Header"
import { CartUpdateContext } from "./_context/cartUpdateContext"
import { useState } from "react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

const Provider = ({ children }: {
    children: React.ReactNode
}) => {

    const [updateCart, setUpdateCart] = useState(false);
    const MASTER_URL = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID


    return (MASTER_URL &&
        <PayPalScriptProvider options={{ clientId: MASTER_URL }}>
            <CartUpdateContext.Provider value={{ updateCart, setUpdateCart }}>
                <div className="mb-10">
                    <Header />
                    <Toaster />
                    {children}
                </div>
            </CartUpdateContext.Provider>
        </PayPalScriptProvider>
    )
}

export default Provider
