import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"
import toast from 'react-hot-toast';


export interface Product {
    id: string
    title: string
    image: string
    price: number
    quantity?: number
}

interface State {
    cart: Product[]
    totalItems: number
    totalPrice: number
}

interface Actions {
    addToCart: (Item: Product) => void
    removeFromCart: (Item: Product) => void
    decrease: (Item: Product) => void
    clearCart: () => void
}

const INITIAL_STATE: State = {
    cart: [],
    totalItems: 0,
    totalPrice: 0,
}

export const useCartStore = create(
    persist<State & Actions>(
        (set, get) => ({
            cart: INITIAL_STATE.cart,
            totalItems: INITIAL_STATE.totalItems,
            totalPrice: INITIAL_STATE.totalPrice,

            // add to cart item
            addToCart: (product: Product) => {
                const cart = get().cart
                const cartItem = cart.find(item => item.id === product.id)


                // If the item already exists in the Cart, increase its qty
                if (cartItem) {
                    const updatedCart = cart.map(item =>
                        item.id === product.id ? { ...item, quantity: (item.quantity as number) + 1 } : item
                    )
                    set(state => ({
                        cart: updatedCart,
                        totalItems: state.totalItems + 1,
                        totalPrice: state.totalPrice + product.price,
                    }))
                } else {
                    const updatedCart = [...cart, { ...product, quantity: 1 }]

                    set(state => ({
                        cart: updatedCart,
                        totalItems: state.totalItems + 1,
                        totalPrice: state.totalPrice + product.price,
                    }))
                }
                toast.success('Product added to cart');
            },

            decrease: (product: Product) => {
                const cart = get().cart

                if (product.quantity == 1) {
                    set(state => ({
                        cart: state.cart.filter(item => item.id !== product.id),
                        totalItems: state.totalItems - product.quantity!,
                        totalPrice: state.totalPrice - (product.quantity! * product.price),
                    }))
                    toast.success('Product item deleted from cart');
                } else {
                    const updatedCart = cart.map(item =>
                        item.id === product.id ? { ...item, quantity: (item.quantity as number) - 1 } : item
                    )
                    set(state => ({
                        cart: updatedCart,
                        totalItems: state.totalItems - 1,
                        totalPrice: state.totalPrice - product.price,
                    }))
                    toast.success('Decrase quantity product in cart');

                }
            },

            // remove cart ite,
            removeFromCart: (product: Product) => {
                set(state => ({
                    cart: state.cart.filter(item => item.id !== product.id),
                    totalItems: state.totalItems - product.quantity!,
                    totalPrice: state.totalPrice - (product.quantity! * product.price),
                }))
                toast.success('Product item deleted from cart');
            },

            clearCart: ()=> {
                set(state => ({
                    cart: [],
                    totalItems: 0,
                    totalPrice: 0,
                }))
            }
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    ))