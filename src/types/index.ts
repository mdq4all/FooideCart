export type Category = {
    id: string;
    name: string;
    slug: string;
    icon: {
        url: string
    }
}

export type MenuItem = {
    category: string;
    id: string;
    menuItem: [
        {
            description: string;
            id: string;
            name: string;
            price: number;
            productImage: [
                {
                    url: string
                }
            ]
        }
    ]
}

export type Business = {
    id: string;
    name: string;
    slug: string;
    banner: {
        url: string
    }
    categories: [
        {
            name: string
        }
    ]
    restoType: string[];
    workingHours: string;
    aboutUs: string;
    address: string;
    menu: MenuItem[]
    reviews: [
        {
            star: number
        }
    ]
}

export type UserCart = {
    email: string,
    productName: string,
    price: number,
    productDescription: string,
    productImage: string,
    restauranteSlug: string
}

export type Cart = {
    id: string;
    email: string,
    productName: string,
    price: number,
    productDescription: string,
    productImage: string,
    restaurante: {
        banner: {
            url: string;
        };
        name: string;
        slug: string;
    }
}

export type Review = {
    email: string;
    id: string;
    profileImage: string;
    publishedAt: string;
    reviewText: string;
    star: number;
    userName: string;
}

export type Order = {
    email: string;
    orderAmount: number
    restauranteName: string;
    userName: string;
    address: string;
    zipCode: string;
    phoneNumber: string;
}

export type UserOrder = {
    createdAt: string;
    id: string;
    orderAmount: number;
    orderDetail: [
        {
            name: string;
            orderPrice: number
        }
    ]
    restauranteName: string;
    userName:string
}