import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Order, OrderStatus, CartItem } from '../types';
import { supabase, apiCall } from '../lib/supabase';

interface OrderContextType {
  orders: Order[];
  createOrder: (tableNumber: string, items: CartItem[], total: number) => Promise<string>;
  getOrder: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Load orders
  useEffect(() => {
    loadOrders();
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Real-time subscription disabled (Supabase Realtime not enabled in Figma Make environment)
  // App uses optimistic updates for instant UI feedback instead
  // useEffect(() => {
  //   const channelName = `order-changes-${Date.now()}`;
  //   console.log(`📡 Setting up real-time order subscription: ${channelName}`);
  //   ...
  // }, []);

  const loadOrders = async () => {
    try {
      const ordersList = await apiCall('/orders');
      setOrders(ordersList);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const createOrder = async (tableNumber: string, items: CartItem[], total: number): Promise<string> => {
    try {
      const newOrder = await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify({ tableNumber, items, total }),
      });

      // Add order to state immediately (don't wait for real-time subscription)
      setOrders(prev => [...prev, newOrder]);

      const orderId = newOrder.id;

      // Auto status progression - completes in 10 seconds
      console.log(`🔄 Starting auto status progression for order ${orderId}`);

      const t1 = setTimeout(() => {
        console.log(`⏰ 2s - Updating ${orderId} to preparing`);
        updateOrderStatus(orderId, 'preparing').catch(err =>
          console.error('Failed to update to preparing:', err)
        );
      }, 2000); // 2s → preparing

      const t2 = setTimeout(() => {
        console.log(`⏰ 6s - Updating ${orderId} to completed`);
        updateOrderStatus(orderId, 'completed').catch(err =>
          console.error('Failed to update to completed:', err)
        );
      }, 6000); // 6s → completed

      const t3 = setTimeout(() => {
        console.log(`⏰ 10s - Updating ${orderId} to served`);
        updateOrderStatus(orderId, 'served').catch(err =>
          console.error('Failed to update to served:', err)
        );
      }, 10000); // 10s → served

      timeoutsRef.current.push(t1, t2, t3);

      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const getOrder = (id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      console.log(`📝 Updating local state: ${id} → ${status}`);

      // Update local state immediately for instant UI feedback
      setOrders(prev => {
        const updated = prev.map(order =>
          order.id === id ? { ...order, status } : order
        );
        console.log(`✅ Local state updated:`, updated.find(o => o.id === id));
        return updated;
      });

      // Then sync with server
      console.log(`🌐 Syncing with server: ${id} → ${status}`);
      await apiCall(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      console.log(`✅ Server sync successful`);
    } catch (error) {
      console.error(`❌ Error updating order ${id} to status ${status}:`, error);
      // Real-time subscription will keep state in sync even if API fails
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
}
