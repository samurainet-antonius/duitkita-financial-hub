
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wallet, CreditCard, Smartphone, Building, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { ShareWalletDialog } from "@/components/ShareWalletDialog";
import { useWallets } from "@/hooks/useWallets";
import { useTransactions } from "@/hooks/useTransactions";
import { useSharedWallets } from "@/hooks/useSharedWallets";

const Wallets = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  
  const { data: wallets = [], isLoading: walletsLoading } = useWallets();
  const { data: sharedWallets = [] } = useSharedWallets();
  const { data: recentTransactions = [] } = useTransactions();

  const mappedSharedWallets = sharedWallets.map((shared) => ({
    ...shared.wallets,
    isShared: true,
    role: shared.role,
  }));

  const allWalletsMap = new Map();

  [...wallets, ...mappedSharedWallets].forEach(wallet => {
    allWalletsMap.set(wallet.id, wallet); // overwrite jika ID sama
  });

  const allWallets = Array.from(allWalletsMap.values());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getWalletTypeLabel = (type: string) => {
    switch (type) {
      case 'bank':
        return 'Bank';
      case 'e_wallet':
        return 'E-Wallet';
      case 'cash':
        return 'Tunai';
      case 'investment':
        return 'Investasi';
      default:
        return 'Lainnya';
    }
  };

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case 'bank':
        return 'bg-blue-100 text-blue-800';
      case 'e_wallet':
        return 'bg-green-100 text-green-800';
      case 'cash':
        return 'bg-gray-100 text-gray-800';
      case 'investment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return Building;
      case 'e_wallet':
        return Smartphone;
      case 'cash':
        return Wallet;
      case 'investment':
        return CreditCard;
      default:
        return Wallet;
    }
  };

  const totalBalance = allWallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);

  if (walletsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-6 bg-white/20 rounded"></div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

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
                <p className="text-emerald-200 text-sm">{allWallets.length} akun aktif</p>
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
                {allWallets.filter(w => w.type === 'bank').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 text-center">
              <Smartphone className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">E-Wallet</p>
              <p className="font-semibold text-green-600">
                {wallets.filter(w => w.type === 'e_wallet').length}
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
          
          {allWallets.map((wallet) => {
            const Icon = getWalletIcon(wallet.type);
            return (
              <Card key={wallet.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${wallet.color || 'bg-blue-600'}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-gray-900">{wallet.name}</p>
                          <Badge className={getWalletTypeColor(wallet.type)}>
                            {getWalletTypeLabel(wallet.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{wallet.account_number || 'No Account'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {showBalance ? formatCurrency(wallet.balance || 0) : "••••••"}
                      </p>
                      <p className="text-xs text-gray-500">Saldo</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    {!wallet.isShared || wallet.role == "owner" ? (
                      <ShareWalletDialog 
                        walletId={wallet.id} 
                        walletName={wallet.name} 
                      />
                    ):(
                      <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-600">
                        Dibagikan ke Saya
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/wallet/${wallet.id}`)}
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {allWallets.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">Belum ada dompet</p>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-green-600"
                onClick={() => navigate('/add-wallet')}
              >
                Tambah Dompet Pertama
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTransactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/transactions')}
              >
                Lihat Semua Transaksi
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Wallets;
