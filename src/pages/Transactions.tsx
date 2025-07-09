
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowRight,
  Download,
  SlidersHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import BottomNavigation from "@/components/BottomNavigation";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";
import { useCategories } from "@/hooks/useCategories";

const Transactions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWallet, setSelectedWallet] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: wallets = [] } = useWallets();
  const { data: categories = [] } = useCategories();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'expense':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'transfer':
        return <ArrowRight className="h-4 w-4 text-blue-600" />;
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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || 
      (transaction.categories && transaction.categories.name === selectedCategory);
    const matchesWallet = selectedWallet === 'all' || 
      (transaction.wallets && transaction.wallets.name === selectedWallet);
    
    return matchesSearch && matchesType && matchesCategory && matchesWallet;
  });

  const groupedTransactions = filteredTransactions.reduce((groups: Record<string, any[]>, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (transactionsLoading) {
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
            <h1 className="text-lg font-semibold">Transaksi</h1>
            <p className="text-emerald-100 text-sm">Riwayat keuangan Anda</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 border-0 text-white">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-xs">Total Income</p>
                  <p className="text-lg font-bold text-green-300">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
                <ArrowUpRight className="h-6 w-6 text-green-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-0 text-white">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-xs">Total Expense</p>
                  <p className="text-lg font-bold text-red-300">
                    {formatCurrency(totalExpense)}
                  </p>
                </div>
                <ArrowDownRight className="h-6 w-6 text-red-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add Transaction Button */}
        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          onClick={() => navigate('/add-transaction')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Transaksi Baru
        </Button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filter Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Tipe</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Kategori</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Dompet</label>
                  <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Dompet</SelectItem>
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.name}>
                          {wallet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedCategory('all');
                    setSelectedWallet('all');
                  }}
                >
                  Reset
                </Button>
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setShowFilters(false)}
                >
                  Terapkan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction List */}
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {format(new Date(date), "dd MMMM yyyy", { locale: id })}
                </h3>
                <div className="text-sm text-gray-500">
                  {dayTransactions.length} transaksi
                </div>
              </div>
              
              <div className="space-y-2">
                {dayTransactions.map((transaction) => (
                  <Card 
                    key={transaction.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/transaction-detail/${transaction.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">
                                {transaction.categories?.name || 'Kategori'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-gray-500">{transaction.time}</p>
                              <Badge variant="outline" className="text-xs">
                                {transaction.type === 'transfer' 
                                  ? `${transaction.wallets?.name} → ${transaction.to_wallets?.name}`
                                  : transaction.wallets?.name || 'Wallet'
                                }
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{transaction.description}</p>
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Tidak ada transaksi yang ditemukan</p>
              <Button 
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => navigate('/add-transaction')}
              >
                Tambah Transaksi Pertama
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Transactions;
