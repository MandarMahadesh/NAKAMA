import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton Supabase client for the frontend
const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'nakama-auth',
  }
});

// API helper functions
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-af190b35`;

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get current session
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  
  // If no access token and this requires auth, throw early with a clear message
  if (!accessToken && endpoint !== '/init-demo') {
    const error = new Error('No authentication token available');
    console.log(`Skipping API call for ${endpoint}: Not authenticated`);
    throw error;
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': accessToken ? `Bearer ${accessToken}` : `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API call failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If we can't parse the error as JSON, use the response text
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      // Only log errors for critical endpoints
      if (response.status !== 401 || !endpoint.includes('/profile')) {
        console.error(`API call failed for ${endpoint}:`, errorMessage);
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    // Don't log network errors for profile - it's optional
    if (!endpoint.includes('/profile') || !(error instanceof TypeError)) {
      console.error(`API call error for ${endpoint}:`, error);
    }
    throw error;
  }
}

// Authentication helper functions
export async function signUp(email: string, password: string, name: string, character: string) {
  try {
    return await apiCall('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, character }),
    });
  } catch (error: any) {
    // Extract the actual error message from the API response
    if (error.message && error.message.includes('API call failed')) {
      if (error.message.includes('already been registered')) {
        throw new Error('A user with this email address has already been registered');
      }
    }
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Get session error:', error);
  }
  return session;
}

// Data API functions
export async function getUserProfile() {
  return apiCall('/profile');
}

export async function getBuddies() {
  return apiCall('/buddies');
}

export async function getChatMessages(buddyId: string) {
  return apiCall(`/chat/${buddyId}`);
}

export async function sendMessage(recipientId: string, message: string) {
  return apiCall('/chat/send', {
    method: 'POST',
    body: JSON.stringify({ recipientId, message }),
  });
}

export async function bookHotel(hotelId: string, hotelName: string, checkIn: string, checkOut: string, price: string) {
  return apiCall('/hotels/book', {
    method: 'POST',
    body: JSON.stringify({ hotelId, hotelName, checkIn, checkOut, price }),
  });
}

export async function rsvpEvent(eventId: string, eventName: string) {
  return apiCall('/events/rsvp', {
    method: 'POST',
    body: JSON.stringify({ eventId, eventName }),
  });
}

export async function addBuddy(buddyId: string) {
  return apiCall('/buddies/add', {
    method: 'POST',
    body: JSON.stringify({ buddyId }),
  });
}

export async function getBuddyRequests() {
  return apiCall('/buddies/requests');
}

export async function acceptBuddyRequest(requestId: string) {
  return apiCall('/buddies/accept', {
    method: 'POST',
    body: JSON.stringify({ requestId }),
  });
}

export async function declineBuddyRequest(requestId: string) {
  return apiCall('/buddies/decline', {
    method: 'POST',
    body: JSON.stringify({ requestId }),
  });
}