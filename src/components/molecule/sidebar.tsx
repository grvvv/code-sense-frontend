import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, BarChart3, Users, PenTool, Layout, Gauge, Send, SearchCode } from 'lucide-react';
import { Badge } from '@/components/atomic/badge';
import { Button } from '@/components/atomic/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/atomic/collapsible';
import { useNavigate } from '@tanstack/react-router';
import { useMyPermissionsQuery } from '@/hooks/use-auth';
import type { AllPermissions } from '@/types/auth';
import { hasAnyPermission } from '@/utils/permissions';
import { DotsLoader } from '../atomic/loader';


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
  requiredPermissions?: (keyof AllPermissions)[];
  requireAll?: boolean;
  alwaysVisible?: boolean; // For items like dashboard, profile, settings
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
    href: '/',
    alwaysVisible: true // Dashboard should always be visible
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: <PenTool className="w-4 h-4" />,
    requiredPermissions: ['view_projects', 'create_project', 'view_findings', 'view_scans'],
    requireAll: false, // Show if user has any project permission
    children: [
      { 
        id: 'new-project', 
        title: 'Create Project', 
        icon: <Send className="w-4 h-4" />, 
        href: '/project/new',
        requiredPermissions: ['create_project']
      },
      { 
        id: 'project-list', 
        title: 'Project List', 
        icon: <Users className="w-4 h-4" />, 
        href: '/project/list',
        requiredPermissions: ['view_projects']
      },
      { 
        id: 'new-scan', 
        title: 'Start Scan', 
        icon: <SearchCode className="w-4 h-4" />, 
        href: '/scan/start',
        requiredPermissions: ['create_scan']
      },
    ]
  },
  {
    id: 'users',
    title: 'Users',
    icon: <Layout className="w-4 h-4" />,
    badge: { text: 'Admin', variant: 'hot' },
    requiredPermissions: ['create_project'], 
    children: [
      { 
        id: 'new-user', 
        title: 'Create User', 
        icon: <BarChart3 className="w-4 h-4" />, 
        href: '/users/new',
        requiredPermissions: ['create_project']
      },
      { 
        id: 'user-list', 
        title: 'Users List', 
        icon: <Users className="w-4 h-4" />, 
        href: '/users/list',
        requiredPermissions: ['view_projects']
      }
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
  const { data: userRole, isLoading } = useMyPermissionsQuery();

  // Filter menu items based on permissions
  const filteredMenuItems = useMemo(() => {
    if (isLoading || !userRole) {
      // Show loading state or basic items
      return menuItems.filter(item => item.alwaysVisible);
    }

    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items.filter(item => {
        // Always show items marked as alwaysVisible
        if (item.alwaysVisible) return true;

        // If no permissions required, show the item
        if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
          return true;
        }

        // Check if user has required permissions
        const hasPermission = item.requireAll
          ? item.requiredPermissions.every(permission => 
              userRole.permissions[permission] === true
            )
          : hasAnyPermission(userRole.permissions, item.requiredPermissions);

        if (!hasPermission) return false;

        // If item has children, filter them too
        if (item.children) {
          const filteredChildren = filterItems(item.children);
          // Only show parent if it has visible children or its own href
          return filteredChildren.length > 0 || item.href;
        }

        return true;
      }).map(item => {
        // Filter children recursively
        if (item.children) {
          return {
            ...item,
            children: filterItems(item.children)
          };
        }
        return item;
      });
    };

    return filterItems(menuItems);
  }, [menuItems, userRole, isLoading]);

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
      if (item.href) {
        navigate({
          to: item.href
        });
      }
      return;
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-64 h-screen bg-brand-dark flex flex-col">
        <div className="p-4 h-16 border-b border-brand-light/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-brand-light font-custom text-lg tracking-wider">Code Sense</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-brand-light/60 text-sm"><DotsLoader /></div>
        </div>
      </div>
    );
  }

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
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map(item => renderMenuItem(item))
            ) : (
              <div className="text-brand-light/60 text-sm py-4">
                No menu items available
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* User Role Indicator (Optional - for debugging) */}
      {userRole && (
        <div className="p-4 border-t border-brand-light/20">
          <div className="text-xs text-brand-light/60">
            Role: {userRole.role}
          </div>
        </div>
      )}
    </div>
  );
}