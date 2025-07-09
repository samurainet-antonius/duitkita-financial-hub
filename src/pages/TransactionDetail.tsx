
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app this would come from API/database
  const transaction = {
    id: Number(id),
    type: 'expense',
    category: 'Makanan',
    amount: 45000,
    wallet: 'DANA',
    date: '2024-01-09',
    time: '12:30',
    description: 'Lunch di kantor',
    status: 'completed',
    note: 'Makan siang di warung dekat kantor'
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
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
                  <CardTitle className="text-lg">{transaction.category}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                    <Badge variant="outline">
                      {transaction.wallet}
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
                <p className="text-gray-900">{transaction.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Dompet</label>
                <p className="text-gray-900">{transaction.wallet}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Deskripsi</label>
              <p className="text-gray-900">{transaction.description}</p>
            </div>
            {transaction.note && (
              <div>
                <label className="text-sm font-medium text-gray-500">Catatan</label>
                <p className="text-gray-900">{transaction.note}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Edit Transaksi
          </Button>
          <Button variant="destructive" className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus Transaksi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
