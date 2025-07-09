
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowRight,
  CalendarIcon,
  Download,
  SlidersHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import BottomNavigation from "@/components/BottomNavigation";

interface Transaction {
  id: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  wallet: string;
  walletTo?: string;
  date: string;
  time: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

const Transactions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWallet, setSelectedWallet] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [showFilters, setShowFilters] = useState(false);

  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'income',
      category: 'Gaji',
      amount: 8500000,
      wallet: 'BCA',
      date: '2024-01-09',
      time: '09:00',
      description: 'Gaji bulan Januari',
      status: 'completed'
    },
    {
      id: 2,
      type: 'expense',
      category: 'Makanan',
      amount: 45000,
      wallet: 'DANA',
      date: '2024-01-09',
      time: '12:30',
      description: 'Lunch di kantor',
      status: 'completed'
    },
    {
      id: 3,
      type: 'expense',
      category: 'Transport',
      amount: 25000,
      wallet: 'GoPay',
      date: '2024-01-09',
      time: '18:00',
      description: 'Ojek online pulang',
      status: 'completed'
    },
    {
      id: 4,
      type: 'transfer',
      category: 'Transfer',
      amount: 500000,
      wallet: 'BCA',
      walletTo: 'Mandiri',
      date: '2024-01-09',
      time: '20:00',
      description: 'Transfer ke tabungan',
      status: 'completed'
    },
    {
      id: 5,
      type: 'expense',
      category: 'Belanja',
      amount: 150000,
      wallet: 'DANA',
      date: '2024-01-08',
      time: '16:30',
      description: 'Belanja bulanan',
      status: 'completed'
    },
    {
      id: 6,
      type: 'income',
      category: 'Freelance',
      amount: 2000000,
      wallet: 'BCA',
      date: '2024-01-08',
      time: '14:00',
      description: 'Project website',
      status: 'pending'
    },
    {
      id: 7,
      type: 'expense',
      category: 'Hiburan',
      amount: 80000,
      wallet: 'GoPay',
      date: '2024-01-07',
      time: '19:30',
      description: 'Bioskop',
      status: 'completed'
    },
    {
      id: 8,
      type: 'expense',
      category: 'Kesehatan',
      amount: 300000,
      wallet: 'Mandiri',
      date: '2024-01-07',
      time: '10:00',
      description: 'Cek dokter',
      status: 'completed'
    }
  ];

  const categories = [
    'Gaji', 'Freelance', 'Investasi', 'Bonus',
    'Makanan', 'Transport', 'Belanja', 'Hiburan', 'Kesehatan', 'Pendidikan'
  ];

  const wallets = ['BCA', 'Mandiri', 'DANA', 'GoPay', 'Cash'];

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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    const matchesWallet = selectedWallet === 'all' || transaction.wallet === selectedWallet;
    
    return matchesSearch && matchesType && matchesCategory && matchesWallet;
  });

  const groupedTransactions = filteredTransactions.reduce((groups: Record<string, Transaction[]>, transaction) => {
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
                <Filter className="h-5 w-5 mr-2" />
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
                        <SelectItem key={category} value={category}>
                          {category}
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
                        <SelectItem key={wallet} value={wallet}>
                          {wallet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Tanggal</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "dd MMM", { locale: id })} -{" "}
                              {format(dateRange.to, "dd MMM", { locale: id })}
                            </>
                          ) : (
                            format(dateRange.from, "dd MMM yyyy", { locale: id })
                          )
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from || undefined}
                        selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
                        onSelect={(range) => setDateRange({ from: range?.from || null, to: range?.to || null })}
                        numberOfMonths={1}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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
                    setDateRange({ from: null, to: null });
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
                              <p className="font-medium text-gray-900">{transaction.category}</p>
                              <Badge className={getStatusColor(transaction.status)}>
                                {transaction.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-gray-500">{transaction.time}</p>
                              <Badge variant="outline" className="text-xs">
                                {transaction.type === 'transfer' 
                                  ? `${transaction.wallet} → ${transaction.walletTo}`
                                  : transaction.wallet
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
