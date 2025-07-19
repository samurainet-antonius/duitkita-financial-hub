
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Wallets from "./pages/Wallets";
import AddWallet from "./pages/AddWallet";
import EditWallet from "./pages/EditWallet";
import WalletDetail from "./pages/WalletDetail";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import EditTransaction from "./pages/EditTransaction";
import TransactionDetail from "./pages/TransactionDetail";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import Settings from "./pages/Settings";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactSupport from "./pages/ContactSupport";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth"; // 🆕 Tambahkan ini

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider> */}
        <TooltipProvider>
          <Toaster />
          <AuthProvider> {/* 🆕 Tambahkan di sini */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/wallets" element={<ProtectedRoute><Wallets /></ProtectedRoute>} />
              <Route path="/add-wallet" element={<ProtectedRoute><AddWallet /></ProtectedRoute>} />
              <Route path="/edit-wallet/:id" element={<ProtectedRoute><EditWallet /></ProtectedRoute>} />
              <Route path="/wallet/:id" element={<ProtectedRoute><WalletDetail /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
              <Route path="/add-transaction" element={<ProtectedRoute><AddTransaction /></ProtectedRoute>} />
              <Route path="/edit-transaction/:id" element={<ProtectedRoute><EditTransaction /></ProtectedRoute>} />
              <Route path="/transaction/:id" element={<ProtectedRoute><TransactionDetail /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
              <Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
              <Route path="/contact-support" element={<ProtectedRoute><ContactSupport /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}

export default App;
