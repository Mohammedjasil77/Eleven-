import React from "react";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "./Context/ProtectedRoute";
import AdminRoute from "./Pages/Auth/AdminRoute";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./Pages/NonAuth/Home/HomePage";
import Registration from "./Pages/Auth/Registration";
import Login from "./Pages/Auth/Login";
import NotFound from "./Pages/NonAuth/NotFound/NotFound";
import Navbar from "./Components/Navbar/Navbar";
import ShopPage from "./Pages/NonAuth/shop/Shop";
import NewArrivals from "./Pages/NonAuth/Home/NewArrivals";
import ProductDetails from "./Pages/NonAuth/Products/ProductDetails";
import CartPage from "./Pages/NonAuth/Cart/Cart";
import WishlistPage from "./Pages/NonAuth/Cart/wishlist";
import AboutPage from "./Pages/NonAuth/About";
import CategoryProducts from "./Pages/NonAuth/Products/CategoryProducts";
import Footer from "./Components/Footer";
import BuyNowPage from "./Pages/NonAuth/BuyNow";
import "react-toastify/dist/ReactToastify.css";
import TrackOrder from "./Pages/NonAuth/TrackOrder";
import Contact from "./Pages/NonAuth/Contact";
import OrderTrackingDetail from "./Pages/NonAuth/OrderTrackingDetail";

// Admin side //
import AdminDashboard from "./Components/Admin/pages/Admin Pages/AdminDashbord";
import UserManagement from "./Components/Admin/pages/Admin Pages/Users/UserManagment";
import ProductManagement from "./Components/Admin/pages/Admin Pages/Products/ProductsManagment";
import AddProduct from "./Components/Admin/pages/Admin Pages/Products/AddProducts";
import EditProduct from "./Components/Admin/pages/Admin Pages/Products/EditProducts";
import OrderManagement from "./Components/Admin/pages/Admin Pages/Order/OrderManagment";


// Layout component to handle conditional rendering
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Only show Navbar for non-admin routes */}
      {!isAdminRoute && <Navbar />}
      
      <main className="min-h-screen">
        {children}
      </main>

      {/* Only show Footer for non-admin routes */}
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <>
      <AppLayout>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/category/:categoryId" element={<CategoryProducts />} />
          <Route
            path="/buy-now"
            element={
              <ProtectedRoute>
                <BuyNowPage />
              </ProtectedRoute>
            }
          />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/track-order/:orderId" element={<OrderTrackingDetail/>}/>
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin-dashbord" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <AdminRoute>
                <ProductManagement />
              </AdminRoute>
            }
          />
          <Route 
            path="/admin/products/add"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products/edit/:productId" 
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />
          <Route 
            path="/admin/orders"
            element={
              <AdminRoute>
                <OrderManagement />
              </AdminRoute>
            } 
          />

          {/* 404 route should be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;