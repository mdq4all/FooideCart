"use client"

import { Button } from "@/components/ui/button"
import { SignInButton, SignOutButton, SignUpButton, useUser } from "@clerk/nextjs"
import { Search, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { CartUpdateContext, CartUpdateContextType } from "../_context/cartUpdateContext"
import { useContext, useEffect, useState } from "react"
import GlobalApi from "../_utils/GlobalApi"
import { Cart } from "@/types"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import CartComponent from "./CartComponent"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"




type ApiResponse = {
    userCarts: Cart[]
}


const Header = () => {

    const { user, isSignedIn } = useUser()
    const [cart, setCart] = useState<Cart[] | null>(null);
    const [search, setSearch] = useState('');
    const router = useRouter()

    const { updateCart, setUpdateCart } = useContext<CartUpdateContextType>(CartUpdateContext)

    useEffect(() => {
        user && getUserCarts()
    }, [updateCart || user]);

    const getUserCarts = () => {
        if (user?.primaryEmailAddress) {
            GlobalApi.getUserCart(user?.primaryEmailAddress?.emailAddress).then(res => {
                const apiResponse = res as ApiResponse;
                setCart(apiResponse.userCarts)
            })
        }
    }
    const initSearch = () => {
        setSearch('')
        router.push(`/search/?query=${search}`)
    }

    return (
        <header className="flex justify-between items-center py-2 px-6 md:px-10 shadow-md">
            <div className="flex gap-2 items-center ">
                <Link href='/'>
                    <Image
                        src='/logo.png'
                        width={60}
                        height={60}
                        alt="logo"
                        priority
                        className="h-auto w-auto" />
                </Link>
                <h2 className="text-primary font-bold text-xl">Foodie <span className="text-secondary">Cart</span></h2>
            </div>
            <div className="hidden md:flex items-center bg-slate-300 rounded-lg w-96 py-2 px-4 h-10">
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="restaurante..."
                    className="bg-transparent w-full outline-none placeholder:italic" />
                <button
                    className="outline-primary rounded-full p-1 active:animate-bounce duration-200 disabled:pointer-events-none"
                    onClick={initSearch}
                    disabled={!search}>
                    <Search color="#E26612" />
                </button>
            </div>
            {isSignedIn ? (
                <div className="flex items-center gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="relative p-4 cursor-pointer">
                                <ShoppingCart size={30} />
                                <label className={"absolute right-0 top-1 bg bg-slate-300 rounded-full py-1 px-2 text-sm"}>{cart ? cart?.length : 0}</label>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-full min-w-72">
                            <CartComponent cart={cart} />
                        </PopoverContent>
                    </Popover>

                    {/* <UserButton /> */}

                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <div className="border border-primary p-1 rounded-full hover:opacity-75">
                                <Image
                                    src={user?.imageUrl}
                                    alt="user image"
                                    width={35}
                                    height={35}
                                    className="rounded-full" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href='/user'>
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                            </Link>
                            <Link href="/user#/my-orders">
                                <DropdownMenuItem>My Orders</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                <SignOutButton>
                                    Logout
                                </SignOutButton>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : (
                <div className="flex gap-5">
                    <SignInButton mode="modal">
                        <Button variant='outline'>Login</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button>Signup</Button>
                    </SignUpButton>
                </div>)}
        </header>
    )
}

export default Header
