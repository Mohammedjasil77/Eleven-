// // src/components/admin/layout/AdminHeader.js
// import React, { useContext } from 'react';
// import { AuthContext } from '../../../Context/AuthContext';

// const AdminHeader = () => {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <header className="admin-header">
//       <div className="header-content">
//         <div className="header-left">
//           <h1>Welcome back, {user?.name || 'Admin'}</h1>
//           <p className="current-date">
//             {new Date().toLocaleDateString('en-US', {
//               weekday: 'long',
//               year: 'numeric',
//               month: 'long',
//               day: 'numeric'
//             })}
//           </p>
//         </div>
//         <div className="header-right">
//           <div className="header-actions">
//             <button className="notification-btn">
//               <span className="icon">🔔</span>
//             </button>
//             <button onClick={logout} className="logout-btn">
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AdminHeader;


// src/Layout/AdminLayout.js
// import React, { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";

// const AdminLayout = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const isActiveRoute = (path) =>
//     location.pathname === path || location.pathname.startsWith(path + "/");

//   const handleLogout = () => {
//     if (confirm("Are you sure you want to logout?")) {
//       localStorage.clear();
//       navigate("/login");
//     }
//   };

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={`${
//           isSidebarOpen ? "w-64" : "w-20"
//         } bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col`}
//       >
//         {/* Logo and toggle button */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           <Link
//             to="/admin"
//             className={`text-xl font-semibold text-gray-900 transition ${
//               !isSidebarOpen && "hidden"
//             }`}
//           >
//             Eleven Admin
//           </Link>
//           <button
//             onClick={toggleSidebar}
//             className="text-gray-600 hover:text-gray-900 focus:outline-none"
//           >
//             {isSidebarOpen ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             )}
//           </button>
//         </div>

//         {/* Nav links */}
//         <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//           {[
//             { path: "/admin", name: "Dashboard", icon: "📊" },
//             { path: "/admin/users", name: "Users", icon: "👥" },
//             { path: "/admin/products", name: "Products", icon: "🛍️" },
//             { path: "/admin/orders", name: "Orders", icon: "📦" },
//           ].map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center px-3 py-2 rounded-md font-medium text-sm transition-all duration-300 ${
//                 isActiveRoute(item.path)
//                   ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
//                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//               }`}
//             >
//               <span className="mr-3 text-lg">{item.icon}</span>
//               {isSidebarOpen && <span>{item.name}</span>}
//             </Link>
//           ))}
//         </nav>

//         {/* Logout button */}
//         <div className="p-3 border-t border-gray-200">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center bg-red-600 text-white text-sm font-medium py-2 rounded-md hover:bg-red-700 transition-all duration-300"
//           >
//             🚪 {isSidebarOpen && <span className="ml-2">Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Header (optional) */}
//         <header className="bg-white border-b border-gray-200 shadow-sm p-4 flex justify-between items-center">
//           <h1 className="text-lg font-semibold text-gray-800">
//             {location.pathname
//               .split("/")
//               .pop()
//               .replace(/^\w/, (c) => c.toUpperCase()) || "Dashboard"}
//           </h1>
//         </header>

//         {/* Main Page Content */}
//         <main className="flex-1 p-6">{children}</main>

//         {/* Footer */}
//         <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
//           © 2024 Eleven Store Admin Panel — Version 1.0
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
