import { useState } from 'react';
import { Bell, Settings, User, ChevronDown, Menu, Sun, Moon, LogOut, UserCircle, Mail } from 'lucide-react';
import { Button } from '@/components/atomic/button';
import { Badge } from '@/components/atomic/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atomic/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';

interface HeaderProps {
  onMenuToggle?: () => void;
  notifications?: number;
  onSearch?: (query: string) => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

export default function Header({
  onMenuToggle,
  notifications = 5,
  onProfileClick,
  onSettingsClick,
}: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { logout, user } = useAuth()

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="h-16 w-full bg-brand-light border-b border-brand-dark/10 flex items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-brand-dark hover:bg-brand-dark/10"
          onClick={onMenuToggle}
        >
          <Menu className="w-5 h-5" />
        </Button>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="text-brand-dark hover:bg-brand-dark/10"
          onClick={toggleTheme}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Notifications */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative text-brand-dark hover:bg-brand-dark/10">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-brand-red text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                  {notifications > 9 ? '9+' : notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white border-brand-dark/20">
            <DropdownMenuLabel className="text-brand-dark flex items-center justify-between">
              <span>Notifications</span>
              <Badge className="bg-brand-red text-white">{notifications}</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-brand-dark/20" />
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="text-brand-dark hover:bg-brand-dark/10 flex items-start gap-3 p-4">
                <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-dark">New message received</p>
                  <p className="text-xs text-brand-dark/60">2 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-brand-dark hover:bg-brand-dark/10 flex items-start gap-3 p-4">
                <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-dark">System update available</p>
                  <p className="text-xs text-brand-dark/60">1 hour ago</p>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-brand-dark hover:bg-brand-dark/10">
              <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-brand-dark capitalize">{user?.name}</p>
                <p className="text-xs text-brand-dark/60 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-brand-dark/60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-brand-dark/20">
            <DropdownMenuLabel className="text-brand-dark">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">{user?.name}</p>
                  <p className="text-xs text-brand-dark/60 capitalize">{user?.role}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-brand-dark/20" />
            
            {/* Profile Link */}
            <DropdownMenuItem className="text-brand-dark hover:bg-brand-dark/10 cursor-pointer p-0">
              <a 
                href="/profile" 
                className="w-full flex items-center px-2 py-1.5"
                onClick={onProfileClick}
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </a>
            </DropdownMenuItem>
            
            {/* Settings Link */}
            <DropdownMenuItem className="text-brand-dark hover:bg-brand-dark/10 cursor-pointer p-0">
              <a 
                href="/settings" 
                className="w-full flex items-center px-2 py-1.5"
                onClick={onSettingsClick}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </a>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-brand-dark/20" />
            <DropdownMenuItem 
              className="text-brand-red hover:bg-brand-red/10 cursor-pointer"
              onClick={() => logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}