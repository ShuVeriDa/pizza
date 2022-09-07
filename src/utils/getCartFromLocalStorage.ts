//1 option
// export const getCartFromLocalStorage = () => {
//    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : []
// }

// 2 option
import {calcTotalPrice} from "./calcTotalPrice";

export const getCartFromLocalStorage = () => {
   const data = localStorage.getItem('cart')
   const items = data ? JSON.parse(data) : []
   const totalPrice = calcTotalPrice(items)

   return {
      items: items,
      totalPrice: totalPrice
   }
}
