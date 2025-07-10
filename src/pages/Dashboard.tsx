
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Settings, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { useWallets } from "@/hooks/useWallets";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedWallet, setSelectedWallet] = useState("all");

  const { data: wallets = [] } = useWallets();
  const { data: transactions = [] } = useTransactions();
  const { data: categories = [] } = useCategories();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate totals
  const totalBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Today's transactions
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date === today);

  // Generate chart data from real transactions
  const generateChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => t.date === dateStr);
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      last7Days.push({
        name: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        income,
        expense
      });
    }
    return last7Days;
  };

  const chartData = generateChartData();

  // Calculate expense categories from real data
  const expenseCategories = categories
    .filter(cat => cat.type === 'expense')
    .map(cat => {
      const categoryTransactions = transactions.filter(t => 
        t.type === 'expense' && t.category_id === cat.id
      );
      const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        name: cat.name,
        value: total,
        color: cat.color || '#6366F1'
      };
    })
    .filter(cat => cat.value > 0);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'expense':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'transfer':
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Kategori';
  };

  const getWalletName = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet?.name || 'Wallet';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-emerald-100 text-sm">Kelola keuangan Anda hari ini</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Balance Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="bg-white/10 border-0 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Saldo Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
                </div>
                <Wallet className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-2">
            <Card className="bg-white/10 border-0 text-white">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-xs">Income</p>
                    <p className="text-lg font-bold text-green-300">{formatCurrency(totalIncome)}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-300" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-0 text-white">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-xs">Expense</p>
                    <p className="text-lg font-bold text-red-300">{formatCurrency(totalExpense)}</p>
                  </div>
                  <TrendingDown className="h-5 w-5 text-red-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 text-white border-0 hover:bg-white/30"
            onClick={() => navigate('/add-transaction')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Income
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 text-white border-0 hover:bg-white/30"
            onClick={() => navigate('/add-transaction')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Expense
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 text-white border-0 hover:bg-white/30"
            onClick={() => navigate('/add-transaction')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Transfer
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Analytics Charts */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Analytics Keuangan (7 Hari Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        {expenseCategories.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Kategori Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {expenseCategories.map((category, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{category.name}</span>
                    <span className="text-sm font-medium ml-auto">
                      {formatCurrency(category.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Transactions */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Transaksi Hari Ini</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {todayTransactions.length > 0 ? (
                todayTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/transaction-detail/${transaction.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getCategoryName(transaction.category_id || '')}
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-500">{transaction.time}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.type === 'transfer' 
                              ? `${getWalletName(transaction.wallet_id || '')} → ${getWalletName(transaction.to_wallet_id || '')}`
                              : getWalletName(transaction.wallet_id || '')
                            }
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 
                        transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Belum ada transaksi hari ini</p>
                  <Button 
                    className="mt-2 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => navigate('/add-transaction')}
                  >
                    Tambah Transaksi
                  </Button>
                </div>
              )}
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

export default Dashboard;
