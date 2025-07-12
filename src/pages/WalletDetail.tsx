
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useWallets, useDeleteWallet } from "@/hooks/useWallets";
import { useTransactions } from "@/hooks/useTransactions";
import { useSharedWallets } from "@/hooks/useSharedWallets";
import { getWalletIcon } from "@/utils/walletIcons";
import { useAuth } from "@/hooks/useAuth";

const WalletDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: wallets = [] } = useWallets();
  const { data: transactions = [] } = useTransactions(id);
  const { data: sharedAccess = [] } = useSharedWallets(id);
  const deleteWallet = useDeleteWallet();

  const wallet = wallets.find(w => w.id === id);
  const recentTransactions = transactions.slice(0, 5);

  // Check if current user is the owner
  const isOwner = wallet?.user_id === user?.id;

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Dompet tidak ditemukan</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/wallets')}
            >
              Kembali ke Dompet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'expense':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
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

  const handleDeleteWallet = async () => {
    if (!isOwner) {
      alert('Anda tidak memiliki izin untuk menghapus dompet ini');
      return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus dompet ini?')) {
      try {
        await deleteWallet.mutateAsync(wallet.id);
        navigate('/wallets');
      } catch (error) {
        console.error('Error deleting wallet:', error);
      }
    }
  };

  const Icon = getWalletIcon(wallet.type);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/wallets')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          {isOwner && (
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
                onClick={() => navigate(`/edit-wallet/${wallet.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
                onClick={handleDeleteWallet}
                disabled={deleteWallet.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <h1 className="text-xl font-bold">Detail Dompet</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Wallet Info */}
        <Card className="bg-gradient-to-r text-black">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{wallet.name}</h3>
                  <p className="text-black/80">{getWalletTypeLabel(wallet.type)}</p>
                  {wallet.account_number && (
                    <p className="text-black/80 text-sm">{wallet.account_number}</p>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-black">
                IDR
              </Badge>
            </div>
            <div>
              <p className="text-black/80 text-sm">Saldo Tersedia</p>
              <p className="text-2xl font-bold">{formatCurrency(wallet.balance || 0)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => navigate(`/add-transaction?wallet=${wallet.id}`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Transaksi
          </Button>
          {isOwner && (
            <Button 
              variant="outline"
              onClick={() => navigate(`/edit-wallet/${wallet.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Dompet
            </Button>
          )}
        </div>

        {/* Shared Access Info */}
        {sharedAccess.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                Dompet Dibagikan ({sharedAccess.filter(a => a.role === 'user').length} pengguna)
              </h3>
              <p className="text-blue-600 text-sm">
                Dompet ini dapat diakses oleh pengguna lain
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Transaksi Terbaru</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/transactions?wallet=${wallet.id}`)}
              >
                Lihat Semua
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => navigate(`/transaction/${transaction.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.categories?.name || 'Kategori'}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                        <p className="text-xs text-gray-400">{transaction.date} • {transaction.time}</p>
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
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada transaksi</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletDetail;
