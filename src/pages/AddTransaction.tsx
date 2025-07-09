
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CalendarIcon, Upload, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const AddTransaction = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("income");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    wallet: "",
    walletTo: "",
    description: "",
    receipt: null
  });

  const incomeCategories = [
    "Gaji", "Freelance", "Investasi", "Bonus", "Hadiah", "Penjualan", "Lainnya"
  ];

  const expenseCategories = [
    "Makanan", "Transport", "Belanja", "Hiburan", "Kesehatan", "Pendidikan", 
    "Tagihan", "Investasi", "Donasi", "Lainnya"
  ];

  const wallets = [
    { id: "bca", name: "BCA", balance: 12500000 },
    { id: "dana", name: "DANA", balance: 850000 },
    { id: "gopay", name: "GoPay", balance: 320000 },
    { id: "mandiri", name: "Mandiri", balance: 2100000 },
    { id: "cash", name: "Cash", balance: 500000 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmountChange = (value) => {
    // Remove non-numeric characters except comma and dot
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      amount: numericValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.wallet) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi.",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === "transfer" && !formData.walletTo) {
      toast({
        title: "Error",
        description: "Pilih dompet tujuan untuk transfer.",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving transaction
    toast({
      title: "Transaksi Berhasil!",
      description: `${activeTab === 'income' ? 'Pemasukan' : activeTab === 'expense' ? 'Pengeluaran' : 'Transfer'} sebesar ${formatCurrency(parseInt(formData.amount))} telah ditambahkan.`,
    });

    navigate('/transactions');
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'income':
        return <ArrowUpRight className="h-4 w-4 mr-1" />;
      case 'expense':
        return <ArrowDownRight className="h-4 w-4 mr-1" />;
      case 'transfer':
        return <ArrowRight className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getSelectedWallet = () => {
    return wallets.find(w => w.id === formData.wallet);
  };

  const getSelectedWalletTo = () => {
    return wallets.find(w => w.id === formData.walletTo);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Tambah Transaksi</h1>
            <p className="text-emerald-100 text-sm">Catat keuangan Anda</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="income" className="text-green-600">
                    {getTabIcon('income')}
                    Income
                  </TabsTrigger>
                  <TabsTrigger value="expense" className="text-red-600">
                    {getTabIcon('expense')}
                    Expense
                  </TabsTrigger>
                  <TabsTrigger value="transfer" className="text-blue-600">
                    {getTabIcon('transfer')}
                    Transfer
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="income" className="space-y-4 mt-6">
                  {/* Amount */}
                  <div className="text-center space-y-2">
                    <Label className="text-lg font-medium">Jumlah Pemasukan</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-green-600">
                        Rp
                      </span>
                      <Input
                        type="text"
                        placeholder="0"
                        value={formData.amount ? parseInt(formData.amount).toLocaleString('id-ID') : ''}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="text-center text-2xl font-bold pl-12 h-16 border-green-200 focus:border-green-500"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Kategori <span className="text-red-500">*</span></Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Wallet */}
                  <div className="space-y-2">
                    <Label>Dompet <span className="text-red-500">*</span></Label>
                    <Select value={formData.wallet} onValueChange={(value) => handleInputChange('wallet', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih dompet" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.name} - {formatCurrency(wallet.balance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="expense" className="space-y-4 mt-6">
                  {/* Amount */}
                  <div className="text-center space-y-2">
                    <Label className="text-lg font-medium">Jumlah Pengeluaran</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-red-600">
                        Rp
                      </span>
                      <Input
                        type="text"
                        placeholder="0"
                        value={formData.amount ? parseInt(formData.amount).toLocaleString('id-ID') : ''}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="text-center text-2xl font-bold pl-12 h-16 border-red-200 focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Kategori <span className="text-red-500">*</span></Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Wallet */}
                  <div className="space-y-2">
                    <Label>Dompet <span className="text-red-500">*</span></Label>
                    <Select value={formData.wallet} onValueChange={(value) => handleInputChange('wallet', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih dompet" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.name} - {formatCurrency(wallet.balance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="transfer" className="space-y-4 mt-6">
                  {/* Amount */}
                  <div className="text-center space-y-2">
                    <Label className="text-lg font-medium">Jumlah Transfer</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-blue-600">
                        Rp
                      </span>
                      <Input
                        type="text"
                        placeholder="0"
                        value={formData.amount ? parseInt(formData.amount).toLocaleString('id-ID') : ''}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="text-center text-2xl font-bold pl-12 h-16 border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* From Wallet */}
                  <div className="space-y-2">
                    <Label>Dari Dompet <span className="text-red-500">*</span></Label>
                    <Select value={formData.wallet} onValueChange={(value) => handleInputChange('wallet', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih dompet asal" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.name} - {formatCurrency(wallet.balance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* To Wallet */}
                  <div className="space-y-2">
                    <Label>Ke Dompet <span className="text-red-500">*</span></Label>
                    <Select value={formData.walletTo} onValueChange={(value) => handleInputChange('walletTo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih dompet tujuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.filter(w => w.id !== formData.wallet).map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.name} - {formatCurrency(wallet.balance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Date */}
              <div className="space-y-2">
                <Label>Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: id }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Keterangan</Label>
                <Textarea
                  placeholder="Tambahkan keterangan (opsional)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label>Upload Struk/Bukti (Opsional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Klik untuk upload atau drag & drop file
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, PDF (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Summary */}
              {formData.amount && formData.wallet && (
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Ringkasan Transaksi</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tipe:</span>
                        <span className="font-medium">
                          {activeTab === 'income' ? 'Pemasukan' : 
                           activeTab === 'expense' ? 'Pengeluaran' : 'Transfer'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jumlah:</span>
                        <span className={`font-bold ${
                          activeTab === 'income' ? 'text-green-600' : 
                          activeTab === 'expense' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {formatCurrency(parseInt(formData.amount) || 0)}
                        </span>
                      </div>
                      {formData.category && (
                        <div className="flex justify-between">
                          <span>Kategori:</span>
                          <span className="font-medium">{formData.category}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>{activeTab === 'transfer' ? 'Dari:' : 'Dompet:'}</span>
                        <span className="font-medium">{getSelectedWallet()?.name}</span>
                      </div>
                      {activeTab === 'transfer' && formData.walletTo && (
                        <div className="flex justify-between">
                          <span>Ke:</span>
                          <span className="font-medium">{getSelectedWalletTo()?.name}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tanggal:</span>
                        <span className="font-medium">
                          {format(selectedDate, "dd MMMM yyyy", { locale: id })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/dashboard')}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className={`flex-1 ${
                    activeTab === 'income' ? 'bg-green-600 hover:bg-green-700' :
                    activeTab === 'expense' ? 'bg-red-600 hover:bg-red-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Simpan Transaksi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddTransaction;
