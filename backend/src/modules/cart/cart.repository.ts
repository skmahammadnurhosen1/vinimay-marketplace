import { CartEntity } from '../../types/cart.js';
import { getFirestore } from '../../config/firebase.js';
import { logger } from '../../utils/logger.js';
import { env } from '../../config/environment.js';

export interface ICartRepository {
  findByCustomerId(customerId: string): Promise<CartEntity>;
  addItem(customerId: string, productId: string, quantity: number): Promise<CartEntity>;
  updateQuantity(customerId: string, productId: string, quantity: number): Promise<CartEntity>;
  removeItem(customerId: string, productId: string): Promise<CartEntity>;
  clearCart(customerId: string): Promise<void>;
  resetInMemory?(): void;
}

// In-Memory Cart Store
const inMemoryCarts = new Map<string, CartEntity>();

export class CartRepository implements ICartRepository {
  private collectionName = 'carts';

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async findByCustomerId(customerId: string): Promise<CartEntity> {
    if (!this.shouldUseFirestore()) {
      let cart = inMemoryCarts.get(customerId);
      if (!cart) {
        cart = {
          id: customerId,
          customerId,
          items: [],
          updatedAt: new Date().toISOString(),
        };
        inMemoryCarts.set(customerId, cart);
      }
      return { ...cart, items: [...cart.items] };
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(customerId).get();
      if (!doc.exists) {
        const newCart: CartEntity = {
          id: customerId,
          customerId,
          items: [],
          updatedAt: new Date().toISOString(),
        };
        await db.collection(this.collectionName).doc(customerId).set(newCart);
        return newCart;
      }
      return doc.data() as CartEntity;
    } catch (error) {
      logger.warn('Firestore findByCustomerId cart fallback to in-memory:', { customerId, error });
      let cart = inMemoryCarts.get(customerId);
      if (!cart) {
        cart = {
          id: customerId,
          customerId,
          items: [],
          updatedAt: new Date().toISOString(),
        };
        inMemoryCarts.set(customerId, cart);
      }
      return { ...cart, items: [...cart.items] };
    }
  }

  async addItem(customerId: string, productId: string, quantity: number): Promise<CartEntity> {
    const cart = await this.findByCustomerId(customerId);
    const existingIndex = cart.items.findIndex((i) => i.productId === productId);

    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        addedAt: now,
      });
    }
    cart.updatedAt = now;

    inMemoryCarts.set(customerId, { ...cart, items: [...cart.items] });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(customerId).set(cart);
      } catch (error) {
        logger.error('Failed to update cart in Firestore:', { customerId, error });
      }
    }

    return cart;
  }

  async updateQuantity(customerId: string, productId: string, quantity: number): Promise<CartEntity> {
    const cart = await this.findByCustomerId(customerId);
    const item = cart.items.find((i) => i.productId === productId);

    if (item) {
      item.quantity = quantity;
      cart.updatedAt = new Date().toISOString();
      inMemoryCarts.set(customerId, { ...cart, items: [...cart.items] });

      if (this.shouldUseFirestore()) {
        try {
          const db = getFirestore();
          await db.collection(this.collectionName).doc(customerId).set(cart);
        } catch (error) {
          logger.error('Failed to update cart item quantity in Firestore:', { customerId, error });
        }
      }
    }

    return cart;
  }

  async removeItem(customerId: string, productId: string): Promise<CartEntity> {
    const cart = await this.findByCustomerId(customerId);
    cart.items = cart.items.filter((i) => i.productId !== productId);
    cart.updatedAt = new Date().toISOString();

    inMemoryCarts.set(customerId, { ...cart, items: [...cart.items] });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(customerId).set(cart);
      } catch (error) {
        logger.error('Failed to remove cart item in Firestore:', { customerId, error });
      }
    }

    return cart;
  }

  async clearCart(customerId: string): Promise<void> {
    const now = new Date().toISOString();
    const emptyCart: CartEntity = {
      id: customerId,
      customerId,
      items: [],
      updatedAt: now,
    };

    inMemoryCarts.set(customerId, emptyCart);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(customerId).set(emptyCart);
      } catch (error) {
        logger.error('Failed to clear cart in Firestore:', { customerId, error });
      }
    }
  }

  resetInMemory(): void {
    inMemoryCarts.clear();
  }
}

export const cartRepository = new CartRepository();
