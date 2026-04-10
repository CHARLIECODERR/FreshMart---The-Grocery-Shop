import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);

        // Normalize image URL
        const normalizedProduct = {
          ...product,
          imageUrl: product.imageUrl || product.image || product.prodImage || product.thumbnail
        };

        if (existingItem) {
          // Check stock limit before adding more
          if (existingItem.quantity + quantity > product.stock) {
            toast.error(`Only ${product.stock} items available in stock.`);
            return;
          }

          set({
            items: items.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            )
          });
          toast.success(`Updated ${product.name} quantity.`);
        } else {
          // New item
          if (quantity > product.stock) {
            toast.error(`Only ${product.stock} items available in stock.`);
            return;
          }
          
          set({ items: [...items, { ...normalizedProduct, quantity }] });
          toast.success(`Added ${product.name} to cart!`);
        }
      },

      removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== productId) });
        toast.success('Item removed from cart');
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();
        const item = items.find(i => i.id === productId);
        
        if (!item) return;
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        if (quantity > item.stock) {
          toast.error(`Only ${item.stock} items available.`);
          return;
        }

        set({
          items: items.map(i => i.id === productId ? { ...i, quantity } : i)
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Computed derived states
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'freshmart-cart-storage', // unique name for localStorage
    }
  )
);
