import type { StatCountDetails } from '@/types/dashboard';
import { Link } from '@tanstack/react-router';
import { Folder, Search, AlertTriangle, FileText } from 'lucide-react';

const DashboardCards = ({ data }: { data: StatCountDetails | undefined }) => {
  
  const cards = [
    { 
      title: 'Users', 
      icon: <FileText size={28} className="text-[#bf0000]" />, 
      description: 'All Users',
      count: data?.users.toString(),
      href: "/users/list",
      accentColor: '#bf0000'
    },
    { 
      title: 'Project', 
      icon: <Folder size={28} className="text-[#bf0000]" />, 
      description: 'Manage your projects',
      count: data?.projects.toString(),
      href: "/project/list",
      accentColor: '#bf0000'
    },
    { 
      title: 'Scans', 
      icon: <Search size={28} className="text-[#bf0000]" />, 
      description: 'Security scans & audits',
      count: data?.scans.toString(),
      accentColor: '#bf0000'
    },
    { 
      title: 'Findings', 
      icon: <AlertTriangle size={28} className="text-[#bf0000]" />, 
      description: 'Security vulnerabilities',
      count: data?.findings.toString(),
      accentColor: '#bf0000'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-3 min-h-auto">
      {cards.map((card, index) => (
        <Link
          to={card.href}
          key={index}
          className={`
            relative group cursor-pointer
            bg-white border-2 border-gray-200
            rounded-2xl p-6 
            shadow-sm hover:shadow-lg
            transform hover:scale-[1.02] hover:-translate-y-1
            transition-all duration-300 ease-out
            overflow-hidden
            hover:border-gray-300
          `}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Header with icon and action */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300"
              style={{ borderLeft: `3px solid ${card.accentColor}`,borderBottom: `3px solid ${card.accentColor}`}}
            >
              {card.icon}
            </div>
            <span 
                className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300"
                style={{ color: card.accentColor }}
              >
                {card.count}
              </span>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
              {card.title}
            </h2>
            <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
              {card.description}
            </p>
              
              {
                card.href &&
                <div className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                  View all
                </div>
              }
              
            </div>
          </div>
          
          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
        </Link>
      ))}
    </div>
  );
};

export default DashboardCards;