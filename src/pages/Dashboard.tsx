
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedWallet, setSelectedWallet] = useState("all");

  // Sample data
  const chartData = [
    { name: 'Sen', income: 2400, expense: 2400 },
    { name: 'Sel', income: 1398, expense: 2210 },
    { name: 'Rab', income: 9800, expense: 2290 },
    { name: 'Kam', income: 3908, expense: 2000 },
    { name: 'Jum', income: 4800, expense: 2181 },
    { name: 'Sab', income: 3800, expense: 2500 },
    { name: 'Min', income: 4300, expense: 2100 },
  ];

  const expenseCategories = [
    { name: 'Makanan', value: 2400000, color: '#EF4444' },
    { name: 'Transport', value: 800000, color: '#F97316' },
    { name: 'Belanja', value: 1200000, color: '#EAB308' },
    { name: 'Hiburan', value: 600000, color: '#10B981' },
    { name: 'Lainnya', value: 400000, color: '#6366F1' },
  ];

  const todayTransactions = [
    {
      id: 1,
      type: 'income',
      category: 'Gaji',
      amount: 8500000,
      wallet: 'BCA',
      time: '09:00',
      description: 'Gaji bulan ini'
    },
    {
      id: 2,
      type: 'expense',
      category: 'Makanan',
      amount: 45000,
      wallet: 'DANA',
      time: '12:30',
      description: 'Lunch di kantor'
    },
    {
      id: 3,
      type: 'expense',
      category: 'Transport',
      amount: 25000,
      wallet: 'GoPay',
      time: '18:00',
      description: 'Ojek online pulang'
    },
    {
      id: 4,
      type: 'transfer',
      category: 'Transfer',
      amount: 500000,
      wallet: 'BCA → Mandiri',
      time: '20:00',
      description: 'Transfer ke tabungan'
    }
  ];

  const getTransactionIcon = (type) => {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('duitkita_logged_in');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

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
                  <p className="text-2xl font-bold">Rp 15.7M</p>
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
                    <p className="text-lg font-bold text-green-300">+8.5M</p>
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
                    <p className="text-lg font-bold text-red-300">-2.1M</p>
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
            <CardTitle className="text-lg">Analytics Keuangan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
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
                  <Tooltip formatter={(value) => formatCurrency(value)} />
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

        {/* Filters */}
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
            <div className="grid grid-cols-3 gap-3">
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="week">Minggu Ini</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Wallet</SelectItem>
                  <SelectItem value="bca">BCA</SelectItem>
                  <SelectItem value="dana">DANA</SelectItem>
                  <SelectItem value="gopay">GoPay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {todayTransactions.map((transaction) => (
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
                      <p className="font-medium text-gray-900">{transaction.category}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500">{transaction.time}</p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.wallet}
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
              ))}
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
