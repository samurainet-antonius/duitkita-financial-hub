
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";

const WalletDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app this would come from API/database
  const wallet = {
    id: Number(id),
    name: 'BCA',
    type: 'Bank',
    balance: 15750000,
    currency: 'IDR',
    color: 'blue',
    accountNumber: '****1234'
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'income',
      category: 'Gaji',
      amount: 8500000,
      date: '2024-01-09',
      time: '09:00',
      description: 'Gaji bulan Januari'
    },
    {
      id: 2,
      type: 'expense',
      category: 'Transfer',
      amount: 500000,
      date: '2024-01-08',
      time: '20:00',
      description: 'Transfer ke Mandiri'
    }
  ];

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
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <h1 className="text-xl font-bold">Detail Dompet</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Wallet Info */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{wallet.name}</h3>
                <p className="text-blue-100">{wallet.type}</p>
                <p className="text-blue-100 text-sm">{wallet.accountNumber}</p>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {wallet.currency}
              </Badge>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Saldo Tersedia</p>
              <p className="text-2xl font-bold">{formatCurrency(wallet.balance)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => navigate('/add-transaction')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Transaksi
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Dompet
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Transaksi Terbaru</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/transactions')}
              >
                Lihat Semua
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/transaction-detail/${transaction.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.category}</p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletDetail;
