import { UserCart } from "@/types";
import { request, gql } from "graphql-request"

const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

const getCategory = async () => {

  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }
  const query = gql`
  query Categories {
    categories(orderBy: createdAt_DESC) {
      id
      name
      slug
      icon {
        url
      }
    }
  }
 
    `
  const result = await request(MASTER_URL, query)
  return result
}

const getBusiness = async (category: string | null) => {
  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }
  const query = gql`
    query GetBusiness {
        restaurantes(where: {categories_some: {slug: "`+ category + `"}}) {
          aboutUs
          banner {
            url
          }
          categories {
            name
          }
          id
          name
          restoType
          slug
          workingHours
          reviews {
            star
          }
        }
      }
    `
  const result = await request(MASTER_URL, query)
  return result
}

const getRestaurante = async (slug: string | null) => {

  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }
  const query = gql`
query GetRestaurante {
  restaurante(where: {slug: "`+ slug + `"}) {
    aboutUs
    address
    banner {
      url
    }
    categories {
      name
    }
    id
    name
    restoType
    slug
    workingHours
    menu {
      ... on Menu {
        id
        category
        menuItem {
          ... on Menuitem {
            id
            name
            price
            description
            productImage {
              url
            }
          }
        }
      }
    }
    reviews {
      star
    }
  }
}
`
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error listing appointments user", error);
    throw error;
  }
}

const addToCart = async (data: UserCart) => {

  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }

  const query = gql`
  mutation AddToCart {
    createUserCart(
      data: {email: "`+ data.email + `", 
      productDescrption: "`+ data.productDescription + `", productImage: "` + data.productImage + `", 
      productName: "`+ data.productName + `", 
      price: `+ data.price + `,
      restaurante: {connect: {slug: "`+ data.restauranteSlug + `"}}}
    ) {
      id
    }
    publishManyUserCartsConnection(to: PUBLISHED) {
      aggregate {
        count
      }
    }
  }
  
`
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error listing appointments user", error);
    throw error;
  }
}

const getUserCart = async (data: string) => {

  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }

  const query = gql`
  query GetUserCart {
    userCarts(where: {email: "`+ data + `"}) {
      id
      price
      productDescrption
      productImage
      productName
      restaurante {
        banner {
          url
        }
        name
        slug
      }
    }
  }
  `
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error listing appointments user", error);
    throw error;
  }
}


const disconnectRestoFromUserCartItem = async (
  id: string,
  slugResto: string
) => {
  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }

  const query = gql`
  mutation DisconnectRestoFromCartItem {
    updateUserCart(data: {restaurante: {disconnect: true}}, where: {id: "`+ id + `"}) {
      id
    }
    publishUserCart(where: {id: "`+ id + `"}, to: PUBLISHED) {
      id
    }
    publishRestaurante(where: {slug: "`+ slugResto + `"}, to: PUBLISHED) {
      id
    }
  }
  
  `
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error listing appointments user", error);
    throw error;
  }
}

const deleteItemFromCart = async (id: string) => {
  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }

  const query = gql`
  mutation DeleteCartItem {
    deleteUserCart(where: {id: "`+ id + `"}) {
      id
    }
  }
  `
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error listing appointments user", error);
    throw error;
  }
}

const addNewReview = async (data: {
  email: string,
  profileImage: string,
  reviewText: string,
  star: number,
  userName: string,
  restoSlug: string
}) => {

  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }

  const query = gql`
  mutation AddNewReview {
    createReview(
      data: {email: "`+ data.email + `", 
        profileImage: "`+ data.profileImage + `", 
        reviewText: "`+ data.reviewText + `", 
        star: `+ data.star + `, 
        userName: "`+ data.userName + `", 
        restaurante: {connect: {slug: "`+ data.restoSlug + `"}}}
    ) {
      id
    }
    publishManyReviewsConnection(to: PUBLISHED) {
      aggregate {
        count
      }
    }
  }
   `
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error listing appointments user", error);
    throw error;
  }
}

const getRestauranteReviews = async (slug: string) => {

  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }

  const query = gql`
  query RestauranteReviews {
    reviews(where: {restaurante: {slug: "`+ slug + `"}}, orderBy: publishedAt_DESC) {
      email
      id
      star
      userName
      profileImage
      reviewText
      publishedAt
    }
  }
  `
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error getting reviews restaurante", error);
    throw error;
  }
}

const createOrder = async (data: {
  email: string,
  orderAmount: number,
  restauranteName: string,
  userName: string,
  address: string,
  zipCode: string,
  phoneNumber: string
}) => {

  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }

  const query = gql`
  mutation CreateNewOrder {
    createOrder(
      data: {email: "`+ data.email + `", 
        orderAmount: `+ data.orderAmount + `, 
        restauranteName: "`+ data.restauranteName + `", 
        userName: "`+ data.userName + `", 
        address: "`+ data.address + `", 
        zipCode: "`+ data.zipCode + `", 
        phoneNumber: "`+ data.phoneNumber + `"}
    ) {
      id
    }
  }
  `
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error creating order", error);
    throw error;
  }
}

const updateOrder = async (
  name: string,
  price: number,
  id: string,
) => {

  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }

  const query = gql`
  mutation UpdateOrderWithDetail {
    updateOrder(
      data: {orderDetail: {create: {
        OrderItem: {
          data: {
            name: "`+ name + `", 
            orderPrice: `+ price + `}}}}}
      where: {id: "`+ id + `"}
    ) {
      id
    }

    publishManyOrders(to: PUBLISHED) {
      count
    }
  }
   `
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error updating order", error);
    throw error;
  }
}

const emptyUserCart = async (email: string) => {

  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }

  const query = gql`
  mutation DeleteUserCart {
    deleteManyUserCarts(where: {email: "`+ email + `"}) {
      count
    }
  }
  `
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error emprty user cart", error);
    throw error;
  }
}

const getUserOrders = async (email: string) => {

  if (!MASTER_URL) {
    throw new Error('La variable de entorno no está definida');
  }

  const query = gql`
  query GetOrders {
    orders(where: {email: "`+email+`"}, , orderBy: publishedAt_DESC) {
      id
      orderAmount
      orderDetail {
        ... on OrderItem {
          name
          orderPrice
        }
      }
      userName
      restauranteName
      createdAt
    }
  }
  `
  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error get user orders", error);
    throw error;
  }
}

export default {
  getCategory,
  getBusiness,
  getRestaurante,
  addToCart,
  getUserCart,
  disconnectRestoFromUserCartItem,
  deleteItemFromCart,
  addNewReview,
  getRestauranteReviews,
  createOrder,
  updateOrder,
  emptyUserCart,
  getUserOrders
}


