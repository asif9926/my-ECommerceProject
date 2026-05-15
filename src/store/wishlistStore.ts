import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: any[];
  toggleWishlist: (item: any) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      // প্রোডাক্ট থাকলে রিমুভ করবে, না থাকলে অ্যাড করবে
      toggleWishlist: (item) => {
        const currentItems = get().items;
        const exists = currentItems.find((i) => i._id === item._id);
        
        if (exists) {
          set({ items: currentItems.filter((i) => i._id !== item._id) });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      
      removeFromWishlist: (id) => {
        set((state) => ({ items: state.items.filter((i) => i._id !== id) }));
      },
      
      isInWishlist: (id) => {
        return get().items.some((i) => i._id === id);
      },
    }),
    {
      name: 'noir-wishlist-storage', // লোকাল স্টোরেজে সেভ রাখার জন্য
    }
  )
);