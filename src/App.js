import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { ItemProvider } from "./context/ItemContext";
import { AdminProvider } from "./context/AdminContext";
import { ChatProvider } from "./context/ChatContext";
import Toast from "./components/common/Toast";
import { useChat } from "./context/ChatContext";
import Footer from "./components/layout/Footer";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy loaded components - improves initial load time
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const ReportLost = lazy(() => import("./pages/ReportLost"));
const ReportFound = lazy(() => import("./pages/ReportFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SearchItems = lazy(() => import("./pages/SearchItems"));
const ItemDetails = lazy(() => import("./pages/ItemDetails"));
const MyItems = lazy(() => import("./pages/MyItems"));
const EditItem = lazy(() => import("./pages/EditItem"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminItems = lazy(() => import("./pages/AdminItems"));
const AdminHealth = lazy(() => import("./pages/AdminHealth"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminExport = lazy(() => import("./pages/AdminExport"));
const AdminActivityLogs = lazy(() => import("./pages/AdminActivityLogs"));
const AdminContactMessages = lazy(() => import("./pages/AdminContactMessages"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Messages = lazy(() => import("./pages/Messages"));
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute"));
const PublicRoute = lazy(() => import("./components/auth/PublicRoute"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// Wrapper component to use chat context for toast
const AppContent = () => {
  const { toast, clearToast } = useChat();

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Footer Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Protected Search */}
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchItems />
              </ProtectedRoute>
            }
          />

          {/* Public Only Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-items"
            element={
              <ProtectedRoute>
                <MyItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-item/:id"
            element={
              <ProtectedRoute>
                <EditItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-lost"
            element={
              <ProtectedRoute>
                <ReportLost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-found"
            element={
              <ProtectedRoute>
                <ReportFound />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/items"
            element={
              <ProtectedRoute>
                <AdminItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/health"
            element={
              <ProtectedRoute>
                <AdminHealth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/export"
            element={
              <ProtectedRoute>
                <AdminExport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity-logs"
            element={
              <ProtectedRoute>
                <AdminActivityLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contact-messages"
            element={
              <ProtectedRoute>
                <AdminContactMessages />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <Toast
            message={toast.message}
            preview={toast.preview}
            onClose={clearToast}
            onClick={() => {
              if (toast.senderId) {
                window.location.href = `/messages`;
              }
              clearToast();
            }}
          />
        </div>
      )}

      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <ItemProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </ItemProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
