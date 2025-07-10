
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, ArrowUpRight, ArrowDownRight, ArrowRight, FileText } from "lucide-react";
import { useTransactions, useDeleteTransaction } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const transaction = transactions.find(t => t.id === id);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Transaksi tidak ditemukan</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/transactions')}
            >
              Kembali ke Transaksi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="h-6 w-6 text-green-600" />;
      case 'expense':
        return <ArrowDownRight className="h-6 w-6 text-red-600" />;
      case 'transfer':
        return <ArrowRight className="h-6 w-6 text-blue-600" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDeleteTransaction = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await deleteTransaction.mutateAsync(transaction.id);
        navigate('/transactions');
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const getReceiptUrl = (receiptPath: string) => {
    const { data } = supabase.storage
      .from('transaction-receipts')
      .getPublicUrl(receiptPath);
    return data.publicUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/transactions')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={() => navigate(`/edit-transaction/${transaction.id}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={handleDeleteTransaction}
              disabled={deleteTransaction.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <h1 className="text-xl font-bold">Detail Transaksi</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Transaction Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {transaction.categories?.name || 'Kategori'}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">
                      {transaction.type === 'transfer' 
                        ? `${transaction.wallets?.name} → ${transaction.to_wallets?.name}`
                        : transaction.wallets?.name || 'Wallet'
                      }
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 
                  transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tanggal</label>
                <p className="text-gray-900">{transaction.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Waktu</label>
                <p className="text-gray-900">{transaction.time}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Kategori</label>
                <p className="text-gray-900">{transaction.categories?.name || 'Kategori'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tipe</label>
                <p className="text-gray-900 capitalize">{transaction.type}</p>
              </div>
            </div>
            
            {transaction.type === 'transfer' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Dari Dompet</label>
                  <p className="text-gray-900">{transaction.wallets?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ke Dompet</label>
                  <p className="text-gray-900">{transaction.to_wallets?.name}</p>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-gray-500">Dompet</label>
                <p className="text-gray-900">{transaction.wallets?.name}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-500">Deskripsi</label>
              <p className="text-gray-900">{transaction.description}</p>
            </div>
            
            {transaction.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Catatan</label>
                <p className="text-gray-900">{transaction.notes}</p>
              </div>
            )}

            {/* Receipt for expense transactions */}
            {transaction.type === 'expense' && transaction.receipt_url && (
              <div>
                <label className="text-sm font-medium text-gray-500">Bukti Pembayaran</label>
                <div className="mt-2">
                  <img 
                    src={getReceiptUrl(transaction.receipt_url)} 
                    alt="Bukti pembayaran"
                    className="max-w-full h-64 object-cover rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open(getReceiptUrl(transaction.receipt_url), '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Full
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate(`/edit-transaction/${transaction.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Transaksi
          </Button>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleDeleteTransaction}
            disabled={deleteTransaction.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus Transaksi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
