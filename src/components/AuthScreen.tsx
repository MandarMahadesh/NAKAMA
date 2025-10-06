import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from './AuthContext';
import { Ship, User, Mail, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiCall } from '../utils/supabase/client';

export function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');

  const { signIn, signUp } = useAuth();

  // Debounced username availability check
  useEffect(() => {
    if (!isSignUp || !username) {
      setUsernameAvailable(null);
      setUsernameError('');
      return;
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setUsernameAvailable(false);
      setUsernameError('Username must be 3-20 characters (letters, numbers, underscore only)');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setUsernameCheckLoading(true);
      setUsernameError('');
      
      try {
        const response = await apiCall('/check-username', {
          method: 'POST',
          body: JSON.stringify({ username })
        });
        
        setUsernameAvailable(response.available);
        if (!response.available) {
          setUsernameError('This username is already taken');
        }
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(null);
        setUsernameError('Unable to check username availability');
      } finally {
        setUsernameCheckLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (!username) {
          setError('Please enter a username');
          setLoading(false);
          return;
        }
        if (!usernameAvailable) {
          setError('Please choose an available username');
          setLoading(false);
          return;
        }
        await signUp(email, password, name, username);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // Handle specific error cases
      let errorMessage = 'Authentication failed';
      
      if (err.message) {
        if (err.message.includes('already been registered') || err.message.includes('already exists')) {
          errorMessage = 'This email is already registered. Please sign in instead or use a different email.';
        } else if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account.';
        } else if (err.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 px-4">
      {/* Ocean background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1723306743319-a7928c2e628d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMG1hcCUyMHRyZWFzdXJlfGVufDF8fHx8MTc1OTA1MzM5NHww&ixlib=rb-4.1.0&q=80&w=1080')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ship className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">
            Welcome to Nakama
          </CardTitle>
          <CardDescription>
            {isSignUp ? 'Join the crew and start your adventure!' : 'Sign in to continue your journey'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Display Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Choose a unique username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      required
                      className={`pr-10 ${
                        username && usernameAvailable === true ? 'border-green-500' : 
                        username && usernameAvailable === false ? 'border-red-500' : ''
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameCheckLoading && (
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      )}
                      {!usernameCheckLoading && usernameAvailable === true && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {!usernameCheckLoading && usernameAvailable === false && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {usernameError && (
                    <p className="text-xs text-red-600">{usernameError}</p>
                  )}
                  {usernameAvailable === true && (
                    <p className="text-xs text-green-600">Username is available!</p>
                  )}
                  <p className="text-xs text-gray-500">
                    3-20 characters. Letters, numbers, and underscores only.
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <Input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
                {error.includes('already registered') && isSignUp && (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsSignUp(false);
                        setError('');
                      }}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Switch to Sign In
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading || (isSignUp && !usernameAvailable)}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Join Crew' : 'Set Sail')}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Button
              variant="ghost"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setUsername('');
                setUsernameAvailable(null);
                setUsernameError('');
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Join us"}
            </Button>
            
            {!isSignUp && (
              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Demo Account:</p>
                <p>Email: luffy@strawhat.com</p>
                <p>Password: password123</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmail('luffy@strawhat.com');
                    setPassword('password123');
                  }}
                  className="mt-2 text-xs"
                >
                  Use Demo Account
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}