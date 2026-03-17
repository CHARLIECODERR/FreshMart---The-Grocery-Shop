import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Layouts
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import FarmerLayout from '../components/layouts/FarmerLayout';
import AdminLayout from '../components/layouts/AdminLayout';

// Protected Routes
import { 
  CustomerRoute, 
  FarmerRoute, 
  AdminRoute 
} from '../components/ProtectedRoute';

// Loading Fallback
const LoadingFallback = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
    <Loader2 className="animate-spin text-emerald-500" size={48} />
    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">FreshMart Loading...</p>
  </div>
);

// Lazy Loaded Public Pages
const Home = lazy(() => import('../pages/public/Home'));
const Shop = lazy(() => import('../pages/public/Shop'));
const ProductDetails = lazy(() => import('../pages/public/ProductDetails'));
const Categories = lazy(() => import('../pages/public/Categories'));
const CategoryDetails = lazy(() => import('../pages/public/CategoryDetails'));
const Offers = lazy(() => import('../pages/public/Offers'));
const About = lazy(() => import('../pages/public/About'));
const Contact = lazy(() => import('../pages/public/Contact'));
const NotFound = lazy(() => import('../pages/public/NotFound'));
const Unauthorized = lazy(() => import('../pages/public/Unauthorized'));

// Lazy Loaded Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));

// Lazy Loaded Customer Pages
const Account = lazy(() => import('../pages/customer/Account'));
const Orders = lazy(() => import('../pages/customer/Orders'));
const Wishlist = lazy(() => import('../pages/customer/Wishlist'));
const Addresses = lazy(() => import('../pages/customer/Addresses'));
const Cart = lazy(() => import('../pages/customer/Cart'));
const Checkout = lazy(() => import('../pages/customer/Checkout'));
const OrderSuccess = lazy(() => import('../pages/customer/OrderSuccess'));
const OrderDetail = lazy(() => import('../pages/customer/OrderDetail'));

// Lazy Loaded Farmer Pages
const FarmerDashboard = lazy(() => import('../pages/farmer/FarmerDashboard'));
const FarmerProducts = lazy(() => import('../pages/farmer/FarmerProducts'));
const FarmerAddProduct = lazy(() => import('../pages/farmer/FarmerAddProduct'));
const FarmerEditProduct = lazy(() => import('../pages/farmer/FarmerEditProduct'));
const FarmerInventory = lazy(() => import('../pages/farmer/FarmerInventory'));
const FarmerOrders = lazy(() => import('../pages/farmer/FarmerOrders'));
const FarmerCoupons = lazy(() => import('../pages/farmer/FarmerCoupons'));
const FarmerEarnings = lazy(() => import('../pages/farmer/FarmerEarnings'));
const FarmerProfile = lazy(() => import('../pages/farmer/FarmerProfile'));
const FarmerSettings = lazy(() => import('../pages/farmer/FarmerSettings'));

// Lazy Loaded Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminFarmers = lazy(() => import('../pages/admin/AdminFarmers'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('../pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'));
const AdminBanners = lazy(() => import('../pages/admin/AdminBanners'));
const AdminCoupons = lazy(() => import('../pages/admin/AdminCoupons'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

const AppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes with Main Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryDetails />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/cart" element={<Cart />} />
            
            {/* Customer Routes */}
            <Route path="/account" element={<CustomerRoute><Account /></CustomerRoute>} />
            <Route path="/account/orders" element={<CustomerRoute><Orders /></CustomerRoute>} />
            <Route path="/account/wishlist" element={<CustomerRoute><Wishlist /></CustomerRoute>} />
            <Route path="/account/addresses" element={<CustomerRoute><Addresses /></CustomerRoute>} />
            <Route path="/checkout" element={<CustomerRoute><Checkout /></CustomerRoute>} />
            <Route path="/order-success/:orderId" element={<CustomerRoute><OrderSuccess /></CustomerRoute>} />
            <Route path="/account/orders/:orderId" element={<CustomerRoute><OrderDetail /></CustomerRoute>} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Farmer Routes */}
          <Route path="/farmer" element={<FarmerRoute><FarmerLayout /></FarmerRoute>}>
            <Route index element={<FarmerDashboard />} />
            <Route path="products" element={<FarmerProducts />} />
            <Route path="products/new" element={<FarmerAddProduct />} />
            <Route path="products/edit/:id" element={<FarmerEditProduct />} />
            <Route path="inventory" element={<FarmerInventory />} />
            <Route path="orders" element={<FarmerOrders />} />
            <Route path="coupons" element={<FarmerCoupons />} />
            <Route path="earnings" element={<FarmerEarnings />} />
            <Route path="profile" element={<FarmerProfile />} />
            <Route path="settings" element={<FarmerSettings />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="farmers" element={<AdminFarmers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AppRoutes;
