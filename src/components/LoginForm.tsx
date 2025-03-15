
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For simplicity, hardcoded credentials
    if (username === 'admin' && password === 'admin') {
      onLogin(username);
    } else {
      setError('Invalid username or password. Try admin/admin');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl border shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Login to Task Planner</h1>
        <p className="text-muted-foreground">Please sign in to access your tasks</p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="pl-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Login
        </Button>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          <p>Use username: "admin" and password: "admin" to log in</p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
