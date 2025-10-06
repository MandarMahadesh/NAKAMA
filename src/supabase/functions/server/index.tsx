import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.47.6";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client with service role key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Helper function to verify user authentication
async function verifyAuth(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'No access token provided', user: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { error: 'Invalid access token', user: null };
  }

  return { error: null, user };
}

// Health check endpoint
app.get("/make-server-af190b35/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize demo data
app.post("/make-server-af190b35/init-demo", async (c) => {
  try {
    // Create demo user
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'luffy@strawhat.com',
      password: 'password123',
      user_metadata: { 
        name: 'Monkey D. Luffy',
        username: 'captain_luffy',
        avatar_color: getCharacterColor('luffy'),
        created_at: new Date().toISOString()
      },
      email_confirm: true
    });

    if (error && !error.message.includes('already')) {
      console.log(`Demo user creation error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store demo user data in KV store if user was created
    if (data?.user) {
      await kv.set(`user:${data.user.id}`, {
        id: data.user.id,
        name: 'Monkey D. Luffy',
        username: 'captain_luffy',
        avatar_color: getCharacterColor('luffy'),
        status: 'online',
        created_at: new Date().toISOString()
      });
      
      // Reserve the username
      await kv.set('username:captain_luffy', data.user.id);
    }

    return c.json({ success: true, message: 'Demo data initialized' });
  } catch (error) {
    console.log(`Demo initialization error: ${error}`);
    return c.json({ success: true, message: 'Demo user might already exist' });
  }
});

// Check username availability
app.post("/make-server-af190b35/check-username", async (c) => {
  try {
    const { username } = await c.req.json();

    if (!username) {
      return c.json({ error: 'Username is required' }, 400);
    }

    // Check if username exists in KV store
    const existingUsername = await kv.get(`username:${username.toLowerCase()}`);
    
    return c.json({ 
      available: !existingUsername,
      username: username.toLowerCase()
    });
  } catch (error) {
    console.log(`Username check error: ${error}`);
    return c.json({ error: 'Failed to check username availability' }, 500);
  }
});

// User signup
app.post("/make-server-af190b35/signup", async (c) => {
  try {
    const { email, password, name, character } = await c.req.json();
    
    // Support both old 'character' field and new 'username' field
    const username = character;

    // Validate input
    if (!email || !password || !name || !username) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters long' }, 400);
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return c.json({ error: 'Username must be 3-20 characters (letters, numbers, underscore only)' }, 400);
    }

    // Check if username is already taken
    const existingUsername = await kv.get(`username:${username.toLowerCase()}`);
    if (existingUsername) {
      return c.json({ error: 'Username is already taken' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        username: username.toLowerCase(),
        avatar_color: getRandomColor(),
        created_at: new Date().toISOString()
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      
      // Handle specific Supabase auth errors
      let errorMessage = error.message;
      if (error.message.includes('duplicate') || error.message.includes('already exists')) {
        errorMessage = 'A user with this email address has already been registered';
      } else if (error.message.includes('invalid email')) {
        errorMessage = 'Please enter a valid email address';
      } else if (error.message.includes('weak password')) {
        errorMessage = 'Password is too weak. Please choose a stronger password';
      }
      
      return c.json({ error: errorMessage }, 400);
    }

    const avatarColor = getRandomColor();

    // Store additional user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      name,
      username: username.toLowerCase(),
      avatar_color: avatarColor,
      status: 'online',
      created_at: new Date().toISOString()
    });

    // Reserve the username
    await kv.set(`username:${username.toLowerCase()}`, data.user.id);

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Signup failed. Please try again.' }, 500);
  }
});

// Get user profile
app.get("/make-server-af190b35/profile", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const userProfile = await kv.get(`user:${user.id}`);
    return c.json({ profile: userProfile });
  } catch (error) {
    console.log(`Profile fetch error: ${error}`);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Get buddies list
app.get("/make-server-af190b35/buddies", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Get user's buddy list
    const buddyIds = await kv.get(`buddies:${user.id}`) || [];
    const buddies = [];

    for (const buddyId of buddyIds) {
      const buddy = await kv.get(`user:${buddyId}`);
      if (buddy) {
        buddies.push(buddy);
      }
    }

    return c.json({ buddies });
  } catch (error) {
    console.log(`Buddies fetch error: ${error}`);
    return c.json({ error: 'Failed to fetch buddies' }, 500);
  }
});

// Send chat message
app.post("/make-server-af190b35/chat/send", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { recipientId, message } = await c.req.json();
    const messageId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const chatMessage = {
      id: messageId,
      senderId: user.id,
      recipientId,
      message,
      timestamp,
      read: false
    };

    // Store message in KV store
    await kv.set(`message:${messageId}`, chatMessage);

    // Add to both users' chat histories
    const senderChatKey = `chat:${user.id}:${recipientId}`;
    const recipientChatKey = `chat:${recipientId}:${user.id}`;

    const senderMessages = await kv.get(senderChatKey) || [];
    const recipientMessages = await kv.get(recipientChatKey) || [];

    senderMessages.push(messageId);
    recipientMessages.push(messageId);

    await kv.mset([
      [senderChatKey, senderMessages],
      [recipientChatKey, recipientMessages]
    ]);

    return c.json({ message: chatMessage });
  } catch (error) {
    console.log(`Send message error: ${error}`);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Get chat messages
app.get("/make-server-af190b35/chat/:buddyId", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const buddyId = c.req.param('buddyId');
    const chatKey = `chat:${user.id}:${buddyId}`;
    
    const messageIds = await kv.get(chatKey) || [];
    const messages = [];

    for (const messageId of messageIds) {
      const message = await kv.get(`message:${messageId}`);
      if (message) {
        messages.push(message);
      }
    }

    // Sort by timestamp
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return c.json({ messages });
  } catch (error) {
    console.log(`Get messages error: ${error}`);
    return c.json({ error: 'Failed to get messages' }, 500);
  }
});

// Book hotel
app.post("/make-server-af190b35/hotels/book", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { hotelId, hotelName, checkIn, checkOut, price } = await c.req.json();
    const bookingId = crypto.randomUUID();
    
    const booking = {
      id: bookingId,
      userId: user.id,
      hotelId,
      hotelName,
      checkIn,
      checkOut,
      price,
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    };

    await kv.set(`booking:${bookingId}`, booking);

    // Add to user's bookings
    const userBookings = await kv.get(`bookings:${user.id}`) || [];
    userBookings.push(bookingId);
    await kv.set(`bookings:${user.id}`, userBookings);

    return c.json({ booking });
  } catch (error) {
    console.log(`Hotel booking error: ${error}`);
    return c.json({ error: 'Failed to book hotel' }, 500);
  }
});

// RSVP to event
app.post("/make-server-af190b35/events/rsvp", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { eventId, eventName } = await c.req.json();
    const rsvpId = crypto.randomUUID();
    
    const rsvp = {
      id: rsvpId,
      userId: user.id,
      eventId,
      eventName,
      status: 'going',
      rsvpAt: new Date().toISOString()
    };

    await kv.set(`rsvp:${rsvpId}`, rsvp);

    // Add to user's RSVPs
    const userRsvps = await kv.get(`rsvps:${user.id}`) || [];
    userRsvps.push(rsvpId);
    await kv.set(`rsvps:${user.id}`, userRsvps);

    return c.json({ rsvp });
  } catch (error) {
    console.log(`Event RSVP error: ${error}`);
    return c.json({ error: 'Failed to RSVP to event' }, 500);
  }
});

// Add buddy (send buddy request)
app.post("/make-server-af190b35/buddies/add", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { buddyId } = await c.req.json();
    
    // Create buddy request
    const requestId = crypto.randomUUID();
    const request = {
      id: requestId,
      from: user.id,
      to: buddyId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`buddy_request:${requestId}`, request);

    // Add to recipient's pending requests
    const pendingRequests = await kv.get(`buddy_requests:${buddyId}`) || [];
    pendingRequests.push(requestId);
    await kv.set(`buddy_requests:${buddyId}`, pendingRequests);

    return c.json({ success: true, requestId });
  } catch (error) {
    console.log(`Add buddy error: ${error}`);
    return c.json({ error: 'Failed to send buddy request' }, 500);
  }
});

// Get pending buddy requests
app.get("/make-server-af190b35/buddies/requests", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const requestIds = await kv.get(`buddy_requests:${user.id}`) || [];
    const requests = [];

    for (const requestId of requestIds) {
      const request = await kv.get(`buddy_request:${requestId}`);
      if (request && request.status === 'pending') {
        const fromUser = await kv.get(`user:${request.from}`);
        if (fromUser) {
          requests.push({
            id: request.id,
            from: request.from,
            name: fromUser.name,
            character: fromUser.character,
            avatar_color: fromUser.avatar_color,
            status: 'Wants to be your buddy'
          });
        }
      }
    }

    return c.json({ requests });
  } catch (error) {
    console.log(`Get buddy requests error: ${error}`);
    return c.json({ error: 'Failed to get buddy requests' }, 500);
  }
});

// Accept buddy request
app.post("/make-server-af190b35/buddies/accept", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { requestId } = await c.req.json();
    const request = await kv.get(`buddy_request:${requestId}`);

    if (!request || request.to !== user.id) {
      return c.json({ error: 'Invalid request' }, 400);
    }

    // Update request status
    request.status = 'accepted';
    await kv.set(`buddy_request:${requestId}`, request);

    // Add each other as buddies
    const userBuddies = await kv.get(`buddies:${user.id}`) || [];
    const buddyBuddies = await kv.get(`buddies:${request.from}`) || [];

    if (!userBuddies.includes(request.from)) {
      userBuddies.push(request.from);
    }
    if (!buddyBuddies.includes(user.id)) {
      buddyBuddies.push(user.id);
    }

    await kv.mset([
      [`buddies:${user.id}`, userBuddies],
      [`buddies:${request.from}`, buddyBuddies]
    ]);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Accept buddy error: ${error}`);
    return c.json({ error: 'Failed to accept buddy request' }, 500);
  }
});

// Decline buddy request
app.post("/make-server-af190b35/buddies/decline", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { requestId } = await c.req.json();
    const request = await kv.get(`buddy_request:${requestId}`);

    if (!request || request.to !== user.id) {
      return c.json({ error: 'Invalid request' }, 400);
    }

    // Update request status
    request.status = 'declined';
    await kv.set(`buddy_request:${requestId}`, request);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Decline buddy error: ${error}`);
    return c.json({ error: 'Failed to decline buddy request' }, 500);
  }
});

// Profile endpoints
app.get("/make-server-af190b35/profile/documents", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const documents = await kv.get(`documents:${user.id}`) || [];
    return c.json({ documents });
  } catch (error) {
    console.log(`Get documents error: ${error}`);
    return c.json({ error: 'Failed to get documents' }, 500);
  }
});

app.get("/make-server-af190b35/profile/logs", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const logs = await kv.get(`logs:${user.id}`) || [];
    return c.json({ logs });
  } catch (error) {
    console.log(`Get logs error: ${error}`);
    return c.json({ error: 'Failed to get logs' }, 500);
  }
});

app.post("/make-server-af190b35/profile/logs/add", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { title, description, location } = await c.req.json();
    const logs = await kv.get(`logs:${user.id}`) || [];
    
    const newLog = {
      id: `log_${Date.now()}`,
      title,
      description,
      location,
      date: new Date().toISOString()
    };
    
    logs.unshift(newLog);
    await kv.set(`logs:${user.id}`, logs);
    
    return c.json({ success: true, log: newLog });
  } catch (error) {
    console.log(`Add log error: ${error}`);
    return c.json({ error: 'Failed to add log' }, 500);
  }
});

app.get("/make-server-af190b35/profile/favorites", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const favorites = await kv.get(`favorites:${user.id}`) || [];
    return c.json({ favorites });
  } catch (error) {
    console.log(`Get favorites error: ${error}`);
    return c.json({ error: 'Failed to get favorites' }, 500);
  }
});

app.post("/make-server-af190b35/profile/favorites/add", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { name, type, location, itemId } = await c.req.json();
    const favorites = await kv.get(`favorites:${user.id}`) || [];
    
    // Check if already favorited
    const exists = favorites.some((fav: any) => fav.itemId === itemId);
    if (exists) {
      return c.json({ error: 'Already in favorites' }, 400);
    }
    
    const newFavorite = {
      id: `fav_${Date.now()}`,
      itemId,
      name,
      type,
      location,
      savedAt: new Date().toISOString()
    };
    
    favorites.push(newFavorite);
    await kv.set(`favorites:${user.id}`, favorites);
    
    return c.json({ success: true, favorite: newFavorite });
  } catch (error) {
    console.log(`Add favorite error: ${error}`);
    return c.json({ error: 'Failed to add favorite' }, 500);
  }
});

app.post("/make-server-af190b35/profile/favorites/remove", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { favoriteId } = await c.req.json();
    const favorites = await kv.get(`favorites:${user.id}`) || [];
    
    const updatedFavorites = favorites.filter((fav: any) => fav.id !== favoriteId);
    await kv.set(`favorites:${user.id}`, updatedFavorites);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Remove favorite error: ${error}`);
    return c.json({ error: 'Failed to remove favorite' }, 500);
  }
});

// Group/Fleet endpoints
app.get("/make-server-af190b35/groups", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const userGroups = await kv.get(`user_groups:${user.id}`) || [];
    const groups = [];
    
    for (const groupId of userGroups) {
      const group = await kv.get(`group:${groupId}`);
      if (group) {
        groups.push({
          ...group,
          memberCount: group.members?.length || 0
        });
      }
    }
    
    return c.json({ groups });
  } catch (error) {
    console.log(`Get groups error: ${error}`);
    return c.json({ error: 'Failed to get groups' }, 500);
  }
});

app.post("/make-server-af190b35/groups/create", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { name, members } = await c.req.json();
    
    const groupId = `group_${Date.now()}`;
    const allMembers = [user.id, ...members];
    
    const group = {
      id: groupId,
      name,
      createdBy: user.id,
      members: allMembers,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`group:${groupId}`, group);
    
    // Add group to all members' group lists
    for (const memberId of allMembers) {
      const userGroups = await kv.get(`user_groups:${memberId}`) || [];
      userGroups.push(groupId);
      await kv.set(`user_groups:${memberId}`, userGroups);
    }
    
    return c.json({ success: true, group });
  } catch (error) {
    console.log(`Create group error: ${error}`);
    return c.json({ error: 'Failed to create group' }, 500);
  }
});

app.get("/make-server-af190b35/groups/:groupId", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const groupId = c.req.param('groupId');
    const group = await kv.get(`group:${groupId}`);
    
    if (!group) {
      return c.json({ error: 'Group not found' }, 404);
    }
    
    // Verify user is member
    if (!group.members.includes(user.id)) {
      return c.json({ error: 'Not a member of this group' }, 403);
    }
    
    return c.json({ group });
  } catch (error) {
    console.log(`Get group error: ${error}`);
    return c.json({ error: 'Failed to get group' }, 500);
  }
});

app.get("/make-server-af190b35/groups/:groupId/messages", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const groupId = c.req.param('groupId');
    const group = await kv.get(`group:${groupId}`);
    
    if (!group || !group.members.includes(user.id)) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const messages = await kv.get(`group_messages:${groupId}`) || [];
    return c.json({ messages });
  } catch (error) {
    console.log(`Get group messages error: ${error}`);
    return c.json({ error: 'Failed to get messages' }, 500);
  }
});

app.post("/make-server-af190b35/groups/:groupId/messages/send", async (c) => {
  const { error, user } = await verifyAuth(c.req.raw);
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const groupId = c.req.param('groupId');
    const { message } = await c.req.json();
    
    const group = await kv.get(`group:${groupId}`);
    if (!group || !group.members.includes(user.id)) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const userProfile = await kv.get(`user:${user.id}`);
    
    const messages = await kv.get(`group_messages:${groupId}`) || [];
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: userProfile?.name || 'Unknown',
      senderColor: userProfile?.avatar_color || 'bg-blue-500',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    messages.push(newMessage);
    
    // Keep last 100 messages
    if (messages.length > 100) {
      messages.shift();
    }
    
    await kv.set(`group_messages:${groupId}`, messages);
    
    return c.json({ success: true, message: newMessage });
  } catch (error) {
    console.log(`Send group message error: ${error}`);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Helper function to get random color for new users
function getRandomColor(): string {
  const colors = [
    'bg-red-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-pink-500',
    'bg-purple-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-lime-500',
    'bg-rose-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Helper function to get character colors (kept for backward compatibility)
function getCharacterColor(character: string): string {
  const colors: { [key: string]: string } = {
    'luffy': 'bg-red-500',
    'zoro': 'bg-green-500',
    'nami': 'bg-orange-500',
    'usopp': 'bg-yellow-500',
    'sanji': 'bg-blue-500',
    'chopper': 'bg-pink-500',
    'robin': 'bg-purple-500',
    'franky': 'bg-cyan-500',
    'brook': 'bg-gray-500',
    'jinbe': 'bg-indigo-500'
  };
  return colors[character.toLowerCase()] || 'bg-gray-500';
}

Deno.serve(app.fetch);