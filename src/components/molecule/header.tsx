import { useState } from 'react';
import { Settings, User, ChevronDown, Menu, Sun, Moon, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/atomic/button';
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
              onClick={() => logout()}
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