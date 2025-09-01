import { create } from 'zustand';
import { table, upload } from '@devvai/devv-code-backend';

export interface WardrobeItem {
  _id: string;
  _uid: string;
  name: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessories';
  color: string;
  image_url: string;
  brand?: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  tags: string;
  created_at: number;
}

export interface Outfit {
  _id: string;
  _uid: string;
  name: string;
  item_ids: string; // JSON array of wardrobe item IDs
  occasion: string;
  date?: string;
  notes?: string;
  created_at: number;
  favorite: string;
}

interface WardrobeState {
  wardrobeItems: WardrobeItem[];
  outfits: Outfit[];
  isLoading: boolean;
  
  // Wardrobe actions
  loadWardrobeItems: () => Promise<void>;
  addWardrobeItem: (itemData: Omit<WardrobeItem, '_id' | '_uid' | 'created_at'> | (Omit<WardrobeItem, '_id' | '_uid' | 'created_at' | 'image_url'> & { image_url?: string }), file: File | null) => Promise<void>;
  deleteWardrobeItem: (itemId: string, userId: string) => Promise<void>;
  
  // Outfit actions
  loadOutfits: () => Promise<void>;
  saveOutfit: (outfitData: Omit<Outfit, '_id' | '_uid' | 'created_at'>) => Promise<void>;
  deleteOutfit: (outfitId: string, userId: string) => Promise<void>;
  toggleFavoriteOutfit: (outfitId: string, userId: string, isFavorite: boolean) => Promise<void>;
}

export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  wardrobeItems: [],
  outfits: [],
  isLoading: false,

  loadWardrobeItems: async () => {
    set({ isLoading: true });
    try {
      const response = await table.getItems('ewsfm8iuio00', {
        sort: '_id',
        order: 'desc',
        limit: 100
      });
      set({ wardrobeItems: response.items as WardrobeItem[], isLoading: false });
    } catch (error) {
      console.error('Failed to load wardrobe items:', error);
      set({ isLoading: false });
    }
  },

  addWardrobeItem: async (itemData, file) => {
    set({ isLoading: true });
    try {
      let imageUrl = '';
      
      // If file is provided, upload it
      if (file) {
        const uploadResult = await upload.uploadFile(file);
        
        if (upload.isErrorResponse(uploadResult)) {
          throw new Error(uploadResult.errMsg);
        }
        
        imageUrl = uploadResult.link || '';
      } else if ('image_url' in itemData && itemData.image_url) {
        // Use the provided image URL
        imageUrl = itemData.image_url;
      }

      // Add item to database with image URL
      await table.addItem('ewsfm8iuio00', {
        ...itemData,
        image_url: imageUrl,
        created_at: Date.now()
      });

      // Reload items
      await get().loadWardrobeItems();
    } catch (error) {
      console.error('Failed to add wardrobe item:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteWardrobeItem: async (itemId, userId) => {
    try {
      await table.deleteItem('ewsfm8iuio00', {
        _uid: userId,
        _id: itemId
      });
      
      // Update local state
      const updatedItems = get().wardrobeItems.filter(item => item._id !== itemId);
      set({ wardrobeItems: updatedItems });
    } catch (error) {
      console.error('Failed to delete wardrobe item:', error);
      throw error;
    }
  },

  loadOutfits: async () => {
    set({ isLoading: true });
    try {
      const response = await table.getItems('ewsfmjnzpn28', {
        sort: '_id',
        order: 'desc',
        limit: 100
      });
      set({ outfits: response.items as Outfit[], isLoading: false });
    } catch (error) {
      console.error('Failed to load outfits:', error);
      set({ isLoading: false });
    }
  },

  saveOutfit: async (outfitData) => {
    try {
      await table.addItem('ewsfmjnzpn28', {
        ...outfitData,
        created_at: Date.now()
      });
      
      // Reload outfits
      await get().loadOutfits();
    } catch (error) {
      console.error('Failed to save outfit:', error);
      throw error;
    }
  },

  deleteOutfit: async (outfitId, userId) => {
    try {
      await table.deleteItem('ewsfmjnzpn28', {
        _uid: userId,
        _id: outfitId
      });
      
      // Update local state
      const updatedOutfits = get().outfits.filter(outfit => outfit._id !== outfitId);
      set({ outfits: updatedOutfits });
    } catch (error) {
      console.error('Failed to delete outfit:', error);
      throw error;
    }
  },

  toggleFavoriteOutfit: async (outfitId, userId, isFavorite) => {
    try {
      const outfit = get().outfits.find(o => o._id === outfitId);
      if (!outfit) return;

      await table.updateItem('ewsfmjnzpn28', {
        _uid: userId,
        _id: outfitId,
        ...outfit,
        favorite: isFavorite ? 'true' : 'false'
      });
      
      // Update local state
      const updatedOutfits = get().outfits.map(o => 
        o._id === outfitId ? { ...o, favorite: isFavorite ? 'true' : 'false' } : o
      );
      set({ outfits: updatedOutfits });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  },
}));