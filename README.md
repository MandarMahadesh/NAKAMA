# 🏴‍☠️ Nakama - One Piece Travel Companion App

A full-stack, One Piece-themed travel companion application where users can connect with fellow travelers (nakama), chat in real-time, book hotels, RSVP to events, and access various crew member-themed services while roleplaying as members of the Straw Hat Pirates crew.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

## ✨ Features

### 🎭 Core Features
- **User Authentication** - Secure sign-up/login system with custom usernames and availability checking
- **Real-Time Chat** - One-on-one messaging with live updates using Supabase real-time subscriptions
- **Crewmates System** - Friend management with "Add to Crew" functionality and Fleet group chat
- **Profile System (Captain's Log)** - Customizable user profiles with avatar, bio, and personal information
- **Dark/Light Theme** - Comprehensive theme switching with persistent preferences

### 🌟 Crew Member-Themed Features

#### 🗺️ Weather Report (Navigator)
- Real-time weather data powered by Open-Meteo API
- Automatic geolocation detection
- 5-day weather forecast
- Detailed metrics: temperature, humidity, wind speed, visibility, pressure
- Sailing advisories based on conditions

#### 💬 Universal Translator (Archaeologist)
- Multi-language translation using Google Translate API
- Support for 50+ languages
- Text-to-speech functionality
- Translation history

#### 🧭 Navigation (Helmsman)
- Google Maps integration for route planning
- Search destinations
- Get directions with real-time navigation
- Location-based services

#### 🏥 Medical Services (Doctor)
- Browse medical facilities
- Emergency contacts
- Medical history tracking
- Favorites system for hospitals

#### ✈️ Travel Services (Helmsman)
- Browse flights, trains, and transportation options
- Travel itinerary management
- Booking integration
- Favorites functionality

#### 🏨 Hotels & Accommodation
- Browse hotels and accommodations
- Booking system with date selection
- Reviews and ratings
- Real-time availability

#### 🎉 Events & Activities
- Discover local events
- RSVP functionality
- Event categories and filtering
- Calendar integration

#### 🍽️ Restaurants & Dining
- Restaurant discovery
- Menu browsing
- Reviews and ratings
- Reservation system

#### 🛍️ Marketplace (Combined Shopping & Vintage Stores)
- Browse products from various categories
- Electronics, fashion, home goods, vintage items
- Shopping cart functionality
- Favorites system

#### 📚 Historical Archives (Scholar)
- Access historical information about locations
- Cultural insights
- Museum and landmark information
- Educational content

#### 🆘 SOS Emergency Services
- Quick access to emergency contacts
- Police, Fire, Ambulance, Coast Guard
- Direct phone integration (`tel:` links)
- Google Maps integration for emergency locations

### 🎨 UI/UX Features
- Custom nautical-themed scrollbars
- Responsive design for mobile and desktop
- Character-specific color theming
- Search functionality across features
- Favorites system across all services
- Smooth animations and transitions
- Accessibility considerations

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI framework
- **TypeScript 5+** - Type safety
- **Tailwind CSS 4.0** - Styling and design system
- **Lucide React** - Icon library
- **shadcn/ui** - Component library (customized)
- **React Context API** - State management (Auth, Theme)

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Edge Functions (Hono web server)
  - Storage
- **Hono** - Web framework for edge functions

### APIs & Integrations
- **Open-Meteo API** - Weather data (free, no auth required)
- **Google Translate API** - Translation services
- **Google Maps** - Navigation and location services
- **Browser Geolocation API** - User location detection

## 📁 Project Structure

```
├── App.tsx                        # Main application component
├── components/
│   ├── AuthContext.tsx           # Authentication state management
│   ├── ThemeContext.tsx          # Dark/light theme management
│   ├── AuthScreen.tsx            # Login/signup interface
│   ├── HomeScreen.tsx            # Main dashboard
│   ├── ChatScreen.tsx            # Real-time messaging
│   ├── CrewmatesScreen.tsx       # Friend management & group chat
│   ├── ProfileScreen.tsx         # User profile (Captain's Log)
│   ├── WeatherScreen.tsx         # Weather forecast
│   ├── TranslatorScreen.tsx      # Translation service
│   ├── NavigationScreen.tsx      # Maps & directions
│   ├── MedicalScreen.tsx         # Medical facilities
│   ├── TravelScreen.tsx          # Travel services
│   ├── HotelsScreen.tsx          # Hotel bookings
│   ├── EventsScreen.tsx          # Events & RSVPs
│   ├── RestaurantsScreen.tsx     # Restaurant discovery
│   ├── MarketplaceScreen.tsx     # Shopping & marketplace
│   ├── RobinScreen.tsx           # Historical archives
│   ├── ElectronicsScreen.tsx     # Electronics shop
│   ├── SosScreen.tsx             # Emergency services
│   └── ui/                       # shadcn/ui components
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx         # Hono web server
│           └── kv_store.tsx      # Key-value store utilities
├── utils/
│   ├── favorites.tsx             # Favorites management
│   └── supabase/
│       ├── client.tsx            # Supabase client
│       └── info.tsx              # Supabase config
└── styles/
    └── globals.css               # Global styles & Tailwind config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)
- Google Translate API key (optional)
- Google Maps API key (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MandarMahadesh/NAKAMA.git
cd NAKAMA
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
- Create a new project at [supabase.com](https://supabase.com)
- Copy your project URL and anon key
- Update `/utils/supabase/info.tsx` with your credentials

4. **Configure environment variables**
Create a `.env` file in the root directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key (optional)
```

5. **Set up Supabase Database**

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create key-value store table
CREATE TABLE kv_store_af190b35 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE kv_store_af190b35 ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your security requirements)
CREATE POLICY "Enable all access for authenticated users" 
ON kv_store_af190b35 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
```

6. **Deploy Supabase Edge Functions**
```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy make-server-af190b35
```

7. **Start the development server**
```bash
npm run dev
```

8. **Open your browser**
Navigate to `http://localhost:5173` (or your configured port)

## 🎮 Usage

### First Time Setup
1. **Create an account** - Sign up with email and password, choose a unique username
2. **Set up your profile** - Add avatar, bio, and personal information in Captain's Log
3. **Add crewmates** - Search for other users and add them to your crew
4. **Explore features** - Use the search bar or browse pinned features on the home screen

### Key Workflows

#### Sending Messages
1. Navigate to "Message Center" from home
2. Select a crewmate from your list
3. Type and send messages in real-time

#### Checking Weather
1. Open "Weather Report"
2. Allow location access or search for a city
3. View current conditions and 5-day forecast

#### Booking Hotels
1. Navigate to "Hotels"
2. Browse available accommodations
3. Select dates and complete booking

#### Emergency SOS
1. Quick access from "SOS" feature
2. Tap emergency service type
3. Instant call or navigation to nearest location

## 🌐 API Integrations

### Open-Meteo Weather API
- **Free tier** - No API key required
- **Features**: Current weather, 5-day forecast, geolocation support
- **Documentation**: https://open-meteo.com/

### Google Services (Optional)
- **Google Translate API** - For translation feature
- **Google Maps API** - For navigation and location services
- **Setup**: Requires API keys from Google Cloud Console

## 🎨 Theming

The app features a comprehensive theming system:
- **Light Mode** - Clean, bright interface with ocean-themed gradients
- **Dark Mode** - Easy on the eyes with consistent dark palette
- Theme preference persists across sessions
- Each feature has character-specific color accents

## 🔐 Security Features

- Secure authentication with Supabase Auth
- Row-level security policies on database
- Environment variable protection for API keys
- HTTPS-only in production
- Input validation and sanitization

## 📱 Responsive Design

- Mobile-first approach
- Optimized for screens from 320px to 4K
- Touch-friendly interface elements
- Adaptive layouts for different screen sizes

## 🐛 Known Issues & Limitations

- Translation feature requires Google Translate API key
- Some features use mock data for demonstration purposes
- Booking systems are prototype implementations
- Real payment processing not implemented

## 🔮 Future Enhancements

- [ ] Push notifications for messages and events
- [ ] Advanced search and filtering
- [ ] Multi-language UI support
- [ ] Social media integration
- [ ] Advanced booking payment systems
- [ ] Offline mode support
- [ ] Progressive Web App (PWA) capabilities
- [ ] Voice commands and accessibility improvements
- [ ] Analytics and insights dashboard
- [ ] Admin panel for content management

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **One Piece** by Eiichiro Oda - Inspiration for theme and characters
- **shadcn/ui** - Component library foundation
- **Supabase** - Backend infrastructure
- **Open-Meteo** - Weather data API
- **Lucide Icons** - Icon library
- **Tailwind CSS** - Styling framework

## 📧 Contact

For questions, feedback, or support:
- Create an issue in this repository
- Email: your.email@example.com
- Twitter: @yourhandle

## 🎯 Project Status

**Current Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: October 2025

---

Made with ❤️ and inspired by the adventures of the Straw Hat Pirates ⚓🏴‍☠️

*"I don't want to conquer anything. I just think the guy with the most freedom in this whole ocean is the Pirate King!"* - Monkey D. Luffy
