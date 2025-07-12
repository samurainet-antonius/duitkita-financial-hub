
import { Home, Wallet, Receipt, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/dashboard",
      active: location.pathname === "/dashboard"
    },
    {
      icon: Wallet,
      label: "Dompet",
      path: "/wallets",
      active: location.pathname === "/wallets"
    },
    {
      icon: Receipt,
      label: "Transaksi",
      path: "/transactions",
      active: location.pathname === "/transactions"
    },
    {
      icon: Settings,
      label: "Pengaturan",
      path: "/settings",
      active: location.pathname === "/settings"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
