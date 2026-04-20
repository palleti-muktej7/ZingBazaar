import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Deals from "./pages/Deals";

import ShopIndex from "./pages/shop/ShopIndex";
import Products from "./pages/shop/Products";
import ProductDetail from "./pages/shop/ProductDetail";

import FoodIndex from "./pages/food/FoodIndex";
import RestaurantDetail from "./pages/food/RestaurantDetail";

import StyleIndex from "./pages/style/StyleIndex";
import StyleListing from "./pages/style/StyleListing";
import StyleItemDetail from "./pages/style/StyleItemDetail";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/callback" element={<Dashboard />} />

                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/addresses" element={<Addresses />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/deals" element={<Deals />} />

                  <Route path="/shop" element={<ShopIndex />} />
                  <Route path="/shop/products" element={<Products />} />
                  <Route path="/shop/products/:id" element={<ProductDetail />} />

                  <Route path="/food" element={<FoodIndex />} />
                  <Route path="/food/restaurants/:id" element={<RestaurantDetail />} />

                  <Route path="/style" element={<StyleIndex />} />
                  <Route path="/style/listing" element={<StyleListing />} />
                  <Route path="/style/items/:id" element={<StyleItemDetail />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
