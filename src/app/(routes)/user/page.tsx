"use client";

import { UserButton, UserProfile } from "@clerk/nextjs"
import { ShoppingBag } from "lucide-react"
import MyOrders from "./_components/MyOrders";

const UserPage = () => {
    return (
        <div className="flex justify-center items-center mt-5">
            <UserProfile>
                <UserButton.UserProfilePage
                    label="My Orders"
                    labelIcon={<ShoppingBag size={20} />}
                    url="my-orders"
                >
                    <MyOrders />
                </UserButton.UserProfilePage>
            </UserProfile>
        </div>
    )
}

export default UserPage
