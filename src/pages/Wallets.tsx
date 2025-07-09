
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wallet, CreditCard, Smartphone, Building, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const Wallets = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);

  const wallets = [
    {
      id: 1,
      name: "BCA",
      type: "bank",
      balance: 12500000,
      accountNumber: "****1234",
      color: "bg-blue-600",
      icon: Building
    },
    {
      id: 2,
      name: "DANA",
      type: "ewallet",
      balance: 850000,
      accountNumber: "081234****",
      color: "bg-blue-500",
      icon: Smartphone
    },
    {
      id: 3,
      name: "GoPay",
      type: "ewallet",
      balance: 320000,
      accountNumber: "081234****",
      color: "bg-green-600",
      icon: Smartphone
    },
    {
      id: 4,
      name: "Mandiri",
      type: "bank",
      balance: 2100000,
      accountNumber: "****5678",
      color: "bg-yellow-600",
      icon: Building
    },
    {
      id: 5,
      name: "Cash",
      type: "cash",
      balance: 500000,
      accountNumber: "Tunai",
      color: "bg-gray-600",
      icon: Wallet
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getWalletTypeLabel = (type) => {
    switch (type) {
      case 'bank':
        return 'Bank';
      case 'ewallet':
        return 'E-Wallet';
      case 'cash':
        return 'Tunai';
      default:
        return 'Lainnya';
    }
  };

  const getWalletTypeColor = (type) => {
    switch (type) {
      case 'bank':
        return 'bg-blue-100 text-blue-800';
      case 'ewallet':
        return 'bg-green-100 text-green-800';
      case 'cash':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg font-semibold">Dompet Saya</h1>
            <p className="text-emerald-100 text-sm">Kelola semua akun keuangan Anda</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Total Balance */}
        <Card className="bg-white/10 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Total Saldo</p>
                <p className="text-2xl font-bold">
                  {showBalance ? formatCurrency(totalBalance) : "••••••••"}
                </p>
                <p className="text-emerald-200 text-sm">{wallets.length} akun aktif</p>
              </div>
              <Wallet className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 space-y-4">
        {/* Add New Wallet Button */}
        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          onClick={() => navigate('/add-wallet')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Dompet Baru
        </Button>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <Building className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600">Bank</p>
              <p className="font-semibold text-blue-600">
                {wallets.filter(w => w.type === 'bank').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 text-center">
              <Smartphone className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">E-Wallet</p>
              <p className="font-semibold text-green-600">
                {wallets.filter(w => w.type === 'ewallet').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 text-center">
              <Wallet className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-gray-600">Tunai</p>
              <p className="font-semibold text-gray-600">
                {wallets.filter(w => w.type === 'cash').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Wallet List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Semua Dompet</h2>
          
          {wallets.map((wallet) => {
            const Icon = wallet.icon;
            return (
              <Card key={wallet.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/wallet-detail/${wallet.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${wallet.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-gray-900">{wallet.name}</p>
                          <Badge className={getWalletTypeColor(wallet.type)}>
                            {getWalletTypeLabel(wallet.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{wallet.accountNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {showBalance ? formatCurrency(wallet.balance) : "••••••"}
                      </p>
                      <p className="text-xs text-gray-500">Saldo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Transactions per Wallet */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Transfer dari BCA</p>
                  <p className="text-sm text-gray-500">Kemarin, 14:30</p>
                </div>
              </div>
              <p className="font-semibold text-green-600">+Rp 500.000</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Top Up DANA</p>
                  <p className="text-sm text-gray-500">Kemarin, 10:15</p>
                </div>
              </div>
              <p className="font-semibold text-red-600">-Rp 200.000</p>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/transactions')}
            >
              Lihat Semua Transaksi
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Wallets;
