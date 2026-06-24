import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const [dbLoaded, setDbLoaded] = useState(false);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('vjs-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('vjs-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state from DB upon login
  useEffect(() => {
    async function syncFromDb() {
      if (user) {
        try {
          // Fetch backend cart
          const cartRes = await fetch('/api/cart', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          const cartData = await cartRes.json();
          const dbCart = cartData.cart || [];

          // Fetch backend wishlist
          const wishlistRes = await fetch('/api/wishlist', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          const wishlistData = await wishlistRes.json();
          const dbWishlist = wishlistData.wishlist || [];

          // Merge local (guest) cart with DB cart
          setCart((prevCart) => {
            const mergedCart = [...dbCart];
            prevCart.forEach((guestItem) => {
              const existing = mergedCart.find((item) => item.id === guestItem.id);
              if (existing) {
                existing.quantity += guestItem.quantity;
              } else {
                mergedCart.push(guestItem);
              }
            });
            // Push merged cart to DB
            fetch('/api/cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
              },
              body: JSON.stringify({ items: mergedCart })
            }).catch(err => console.error("Error syncing merged cart:", err));

            return mergedCart;
          });

          // Merge local (guest) wishlist with DB wishlist
          setWishlist((prevWishlist) => {
            const mergedWishlist = [...dbWishlist];
            prevWishlist.forEach((guestItem) => {
              const exists = mergedWishlist.some((item) => item.id === guestItem.id);
              if (!exists) {
                mergedWishlist.push(guestItem);
              }
            });
            // Push merged wishlist to DB
            fetch('/api/wishlist', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
              },
              body: JSON.stringify({ items: mergedWishlist })
            }).catch(err => console.error("Error syncing merged wishlist:", err));

            return mergedWishlist;
          });

          setDbLoaded(true);
        } catch (err) {
          console.error("Error syncing cart/wishlist from DB:", err);
          setDbLoaded(true);
        }
      } else {
        // User logged out
        setDbLoaded(false);
        setCart([]);
        setWishlist([]);
      }
    }

    syncFromDb();
  }, [user]);

  // Sync state to DB on local changes
  useEffect(() => {
    if (user && dbLoaded) {
      fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ items: cart })
      }).catch((err) => console.error('Failed to sync cart update to DB:', err));
    }
    localStorage.setItem('vjs-cart', JSON.stringify(cart));
  }, [cart, user, dbLoaded]);

  useEffect(() => {
    if (user && dbLoaded) {
      fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ items: wishlist })
      }).catch((err) => console.error('Failed to sync wishlist update to DB:', err));
    }
    localStorage.setItem('vjs-wishlist', JSON.stringify(wishlist));
  }, [wishlist, user, dbLoaded]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * Number(item.quantity),
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
}
