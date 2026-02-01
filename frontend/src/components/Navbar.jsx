import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, CalendarCheck, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">HRMS Lite</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/')}`}
                >
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    Employees
                  </div>
                </Link>
                <Link
                  to="/attendance"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/attendance')}`}
                >
                  <div className="flex items-center gap-2">
                    <CalendarCheck size={18} />
                    Attendance
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
