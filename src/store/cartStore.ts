import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // 🔥 FIX 1: কার্টে নতুন আইটেম যুক্ত করার স্মার্ট লজিক
      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => 
              i._id === item._id && 
              (i.size || "Default") === (item.size || "Default") && 
              (i.color || "Default") === (item.color || "Default")
          );

          if (existingItemIndex > -1) {
            // আইটেম, সাইজ এবং কালার মিলে গেলে শুধু কোয়ান্টিটি বাড়বে
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += item.quantity;
            return { items: updatedItems };
          }
          // না মিললে নতুন করে যুক্ত হবে
          return { items: [...state.items, item] };
        });
      },

      // 🔥 FIX 2: রিমুভ করার স্মার্ট লজিক
      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(
              i._id === id && 
              (i.size || "Default") === (size || "Default") && 
              (i.color || "Default") === (color || "Default")
            )
          ),
        }));
      },

      // 🔥 FIX 3: কোয়ান্টিটি আপডেট করার লজিক
      updateQuantity: (id, quantity, size, color) => {
        set((state) => ({
          items: state.items.map((i) =>
            i._id === id && 
            (i.size || "Default") === (size || "Default") && 
            (i.color || "Default") === (color || "Default")
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const itemPrice = item.discountPrice || item.price;
          return total + itemPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'twille-cart-storage', // 🔥 FIX 4: নাম পরিবর্তন করে Twille এর নামে রাখা হলো
    }
  )
);