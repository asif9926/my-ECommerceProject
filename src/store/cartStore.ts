import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// কার্টের আইটেমের টাইপ ডিফাইন করা
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

      // কার্টে নতুন আইটেম যুক্ত করা
      addItem: (item) => {
        set((state) => {
          // চেক করা হচ্ছে একই প্রোডাক্ট (একই সাইজ ও কালার সহ) আগে থেকেই কার্টে আছে কি না
          const existingItemIndex = state.items.findIndex(
            (i) => i._id === item._id && i.size === item.size && i.color === item.color
          );

          if (existingItemIndex > -1) {
            // যদি থাকে, শুধু কোয়ান্টিটি বাড়িয়ে দাও
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += item.quantity;
            return { items: updatedItems };
          }
          // না থাকলে নতুন করে যুক্ত করো
          return { items: [...state.items, item] };
        });
      },

      // কার্ট থেকে আইটেম রিমুভ করা
      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i._id === id && i.size === size && i.color === color)
          ),
        }));
      },

      // কোয়ান্টিটি কমানো বা বাড়ানো
      updateQuantity: (id, quantity, size, color) => {
        set((state) => ({
          items: state.items.map((i) =>
            i._id === id && i.size === size && i.color === color
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        }));
      },

      // পুরো কার্ট ক্লিয়ার করা
      clearCart: () => set({ items: [] }),

      // কার্টে মোট কয়টি প্রোডাক্ট আছে তা হিসাব করা
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // কার্টের মোট দাম হিসাব করা
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const itemPrice = item.discountPrice || item.price;
          return total + itemPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'bengaltrek-cart', // এই নামে লোকাল স্টোরেজে ডেটা সেভ থাকবে (যাতে পেজ রিলোড দিলে কার্ট খালি না হয়)
    }
  )
);