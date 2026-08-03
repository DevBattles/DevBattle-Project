import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6 font-medium">
      <Link to="/dashboard" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.replace(/-/g, ' ');

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            {isLast ? (
              <span className="text-slate-200 font-semibold capitalize light:text-slate-900">{formattedName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-indigo-400 transition-colors capitalize">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
