import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BarChart3, Users, PenTool, Smartphone, Layout, Gauge, Send } from 'lucide-react';
import { Badge } from '@/components/atomic/badge';
import { Button } from '@/components/atomic/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/atomic/collapsible';
import { useNavigate } from '@tanstack/react-router';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'hot';
  };
  children?: MenuItem[];
  href?: string;
}

interface SidebarProps {
  menuItems?: MenuItem[];
  activeItem?: string;
  onItemClick?: (item: MenuItem) => void;
}

const defaultMenuItems: MenuItem[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    icon: <Gauge className="w-4 h-4" />,
    href: '/'
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: <PenTool className="w-4 h-4" />,
    children: [
      { id: 'new-project', title: 'Create Project', icon: <Send className="w-4 h-4" />, href: '/project/new' },
      { id: 'project-list', title: 'Project List', icon: <Users className="w-4 h-4" />, href: '/project/list' }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    id: 'users',
    title: 'Users',
    icon: <Layout className="w-4 h-4" />,
    badge: { text: 'Hot', variant: 'hot' },
    children: [
      { id: 'new-project', title: 'Create Users', icon: <BarChart3 className="w-4 h-4" />, href: '/users/newuser' },
      { id: 'project-list', title: 'Users List', icon: <Users className="w-4 h-4" />, href: '/users/listuser' }
    ]
  }
];

const badgeVariants = {
  success: 'bg-brand-red hover:bg-brand-red/90 text-white',
  hot: 'bg-brand-red hover:bg-brand-red/90 text-white',
  default: 'bg-primary hover:bg-primary/90 text-white',
  secondary: 'bg-brand-dark hover:bg-brand-dark/90 text-brand-light',
  destructive: 'bg-brand-red hover:bg-brand-red/90 text-white',
  outline: 'border border-brand-light bg-transparent hover:bg-brand-light/10 text-brand-light'
};

export default function Sidebar({ 
  menuItems = defaultMenuItems, 
  activeItem = 'dashboards',
  onItemClick 
}: SidebarProps) {
  const [openItems, setOpenItems] = useState<string[]>(['projects']);
  const navigate = useNavigate();

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      let items = prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
      return items
      }
    );
  };


  const handleItemClick = (item: MenuItem) => {
    if (!item.children) {
      onItemClick?.(item);
      navigate({
        to: item.href
      })
      return
    }
    
  };


  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isOpen = openItems.includes(item.id);
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="w-full">
        {hasChildren ? (
          <Collapsible open={isOpen} onOpenChange={() => toggleItem(item.id)}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-between px-3 py-2 h-auto font-normal text-left hover:bg-brand-light/50 ${
                  isActive ? 'bg-brand-red text-white hover:bg-brand-red hover:text-white' : 'text-brand-light'
                } ${depth > 0 ? 'pl-6' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm">{item.title}</span>
                  {item.badge && (  
                    <Badge 
                      className={`text-xs px-2 py-0.5 ${badgeVariants[item.badge.variant]}`}
                    >
                      {item.badge.text}
                    </Badge>
                  )}
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {item.children?.map(child => renderMenuItem(child, depth + 1))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Button
            variant="ghost"
            className={`w-full justify-between px-3 py-2 h-auto font-normal text-left hover:bg-brand-light/50 ${
              isActive ? 'bg-brand-red text-white hover:bg-brand-red hover:text-white' : 'text-brand-light'
            } ${depth > 0 ? 'pl-6' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm">{item.title}</span>
              {item.badge && (
                <Badge 
                  className={`text-xs px-2 py-0.5 ml-auto ${badgeVariants[item.badge.variant]}`}
                >
                  {item.badge.text}
                </Badge>
              )}
            </div>
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-brand-dark flex flex-col">
      {/* Header */}
      <div className="p-4 h-16 border-b border-brand-light/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-brand-light font-custom text-lg tracking-wider">Code Sense</span>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="text-xs uppercase tracking-wider text-brand-light/60 font-medium mb-3">
            MENU
          </div>
          <nav className="space-y-1">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>
        </div>
      </div>
    </div>
  );
}