import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MenuItem } from '../types';
import { supabase, apiCall } from '../lib/supabase';

// Menu Context for managing menu items and availability
interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  refreshMenuItems: () => Promise<void>;
  reorderMenuItems: (items: MenuItem[]) => void;
  loading: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMenuItems = useCallback(async () => {
    try {
      console.log('🔄 Loading menu items...');
      setLoading(true);
      const items = await apiCall('/menu-items');

      // Seed if empty
      if (!items || items.length === 0) {
        console.log('📦 Seeding initial data...');
        await apiCall('/seed', { method: 'POST' });
        const seededItems = await apiCall('/menu-items');
        setMenuItems(seededItems);
      } else {
        console.log(`✅ Loaded ${items.length} menu items`);
        setMenuItems(items);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load menu items on mount
  useEffect(() => {
    loadMenuItems();
  }, [loadMenuItems]);

  // Real-time subscription disabled (Supabase Realtime not enabled in Figma Make environment)
  // App uses optimistic updates for instant UI feedback instead
  // useEffect(() => {
  //   const channelName = `menu-changes-${Date.now()}`;
  //   console.log(`📡 Setting up real-time menu subscription: ${channelName}`);
  //   ...
  // }, []);

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      console.log('🍽️ Adding menu item:', item);

      // Calculate next order value
      const maxOrder = menuItems.reduce((max, item) => Math.max(max, item.order ?? 0), -1);
      const itemWithOrder = { ...item, order: maxOrder + 1 };

      const newItem = await apiCall('/menu-items', {
        method: 'POST',
        body: JSON.stringify(itemWithOrder),
      });

      console.log('✅ Menu item created:', newItem);

      // Update local state immediately for instant UI feedback
      setMenuItems(prev => {
        const updated = [...prev, newItem];
        console.log('📝 Updated menu items count:', updated.length);
        return updated;
      });
    } catch (error) {
      console.error('❌ Error adding menu item:', error);
      throw error;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      console.log(`🔄 Updating menu item ${id}:`, updates);

      // Update local state immediately
      setMenuItems(prev =>
        prev.map(item => (item.id === id ? { ...item, ...updates } : item))
      );

      await apiCall(`/menu-items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      console.log('✅ Menu item updated successfully');
    } catch (error) {
      console.error('❌ Error updating menu item:', error);
      throw error;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      console.log(`🗑️ Deleting menu item ${id}`);

      // Update local state immediately
      setMenuItems(prev => prev.filter(item => item.id !== id));

      await apiCall(`/menu-items/${id}`, {
        method: 'DELETE',
      });

      console.log('✅ Menu item deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting menu item:', error);
      throw error;
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      console.log(`🔀 Toggling availability for ${id}`);

      // Get current item
      const currentItem = menuItems.find(item => item.id === id);
      console.log('Current item:', currentItem);

      // Toggle in API and get updated item
      const updatedItem = await apiCall(`/menu-items/${id}/toggle`, {
        method: 'PATCH',
      });

      console.log('✅ Received updated item from API:', updatedItem);

      // Update local state with API response
      setMenuItems(prev => {
        const newItems = prev.map(item =>
          item.id === id ? updatedItem : item
        );
        console.log('📝 Updated local state, new items:', newItems.map(i => ({ id: i.id, available: i.available })));
        return newItems;
      });

      console.log('✅ Availability toggled successfully');
    } catch (error) {
      console.error('❌ Error toggling availability:', error);
      throw error;
    }
  };

  const refreshMenuItems = useCallback(async () => {
    await loadMenuItems();
  }, [loadMenuItems]);

  const reorderMenuItems = useCallback((items: MenuItem[]) => {
    // Update local state immediately
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));
    setMenuItems(reorderedItems);

    // Sync with server in background
    Promise.all(
      reorderedItems.map((item) =>
        apiCall(`/menu-items/${item.id}`, {
          method: 'PUT',
          body: JSON.stringify({ order: item.order }),
        }).catch(err => console.error(`Error updating order for ${item.id}:`, err))
      )
    );
  }, []);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleAvailability,
        refreshMenuItems,
        reorderMenuItems,
        loading,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
}
