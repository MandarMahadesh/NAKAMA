import { apiCall } from './supabase/client';

export async function loadFavoritesForType(type: string): Promise<Set<number>> {
  try {
    const res = await apiCall('/profile/favorites');
    const favs = res.favorites
      .filter((fav: any) => fav.type === type)
      .map((fav: any) => parseInt(fav.itemId));
    return new Set(favs);
  } catch (error) {
    console.error('Error loading favorites:', error);
    return new Set();
  }
}

export async function toggleFavoriteItem(
  itemId: number,
  name: string,
  type: string,
  location: string,
  currentFavorites: Set<number>
): Promise<Set<number>> {
  const newFavorites = new Set(currentFavorites);
  
  try {
    if (currentFavorites.has(itemId)) {
      // Remove from favorites
      const res = await apiCall('/profile/favorites');
      const fav = res.favorites.find((f: any) => f.itemId === itemId.toString() && f.type === type);
      if (fav) {
        await apiCall('/profile/favorites/remove', {
          method: 'POST',
          body: JSON.stringify({ favoriteId: fav.id })
        });
      }
      newFavorites.delete(itemId);
    } else {
      // Add to favorites
      await apiCall('/profile/favorites/add', {
        method: 'POST',
        body: JSON.stringify({
          itemId: itemId.toString(),
          name,
          type,
          location
        })
      });
      newFavorites.add(itemId);
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
  
  return newFavorites;
}