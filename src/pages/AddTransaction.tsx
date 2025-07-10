
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";
import { useCategories } from "@/hooks/useCategories";
import { validateRequired, validateAmount } from "@/utils/validation";
import { getWalletIcon } from "@/utils/walletIcons";

const AddTransaction = () => {
  const navigate = useNavigate();
  const createTransaction = useCreateTransaction();
  const { data: wallets = [] } = useWallets();
  const { data: categories = [] } = useCategories();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    category_id: "",
    wallet_id: "",
    to_wallet_id: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    notes: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const amountError = validateAmount(formData.amount);
    if (amountError) newErrors.amount = amountError;
    
    const descError = validateRequired(formData.description, "Deskripsi");
    if (descError) newErrors.description = descError;
    
    const walletError = validateRequired(formData.wallet_id, "Dompet");
    if (walletError) newErrors.wallet_id = walletError;
    
    if (formData.type === 'transfer') {
      const toWalletError = validateRequired(formData.to_wallet_id, "Dompet tujuan");
      if (toWalletError) newErrors.to_wallet_id = toWalletError;
      
      if (formData.wallet_id === formData.to_wallet_id) {
        newErrors.to_wallet_id = "Dompet tujuan harus berbeda";
      }
    } else {
      const categoryError = validateRequired(formData.category_id, "Kategori");
      if (categoryError) newErrors.category_id = categoryError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    handleInputChange('amount', numericValue);
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, receipt: "Ukuran file maksimal 5MB" }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, receipt: "File harus berupa gambar" }));
        return;
      }
      
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      if (errors.receipt) {
        setErrors(prev => ({ ...prev, receipt: "" }));
      }
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await createTransaction.mutateAsync({
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category_id: formData.type === 'transfer' ? null : formData.category_id,
        wallet_id: formData.wallet_id,
        to_wallet_id: formData.type === 'transfer' ? formData.to_wallet_id : null,
        date: formData.date,
        time: formData.time,
        notes: formData.notes || null
      });

      navigate('/transactions');
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const transactionTypes = [
    { value: "income", label: "Pemasukan", color: "text-green-600" },
    { value: "expense", label: "Pengeluaran", color: "text-red-600" },
    { value: "transfer", label: "Transfer", color: "text-blue-600" }
  ];

  const filteredCategories = categories.filter(cat => 
    formData.type === 'income' ? cat.type === 'income' : cat.type === 'expense'
  );

  const availableToWallets = wallets.filter(wallet => wallet.id !== formData.wallet_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/transactions')}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Tambah Transaksi</h1>
            <p className="text-emerald-100 text-sm">Catat transaksi keuangan Anda</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Detail Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Transaction Type */}
              <div className="space-y-2">
                <Label>Jenis Transaksi</Label>
                <div className="grid grid-cols-3 gap-2">
                  {transactionTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('type', type.value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.type === type.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className={type.color}>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label>Jumlah <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-medium text-gray-600">
                    Rp
                  </span>
                  <Input
                    type="text"
                    placeholder="0"
                    value={formData.amount ? parseInt(formData.amount).toLocaleString('id-ID') : ''}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className={`pl-10 text-lg ${errors.amount ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Deskripsi <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Contoh: Makan siang, Gaji, Transfer ke..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Wallet */}
              <div className="space-y-2">
                <Label>
                  {formData.type === 'transfer' ? 'Dari Dompet' : 'Dompet'} <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.wallet_id} onValueChange={(value) => handleInputChange('wallet_id', value)}>
                  <SelectTrigger className={errors.wallet_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih dompet" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet) => {
                      const WalletIcon = getWalletIcon(wallet.type, wallet.name);
                      return (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          <div className="flex items-center space-x-2">
                            <WalletIcon className="h-4 w-4" />
                            <span>{wallet.name}</span>
                            <span className="text-sm text-gray-500">
                              Rp {wallet.balance?.toLocaleString('id-ID') || '0'}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.wallet_id && <p className="text-sm text-red-500">{errors.wallet_id}</p>}
              </div>

              {/* To Wallet (for transfer) */}
              {formData.type === 'transfer' && (
                <div className="space-y-2">
                  <Label>Ke Dompet <span className="text-red-500">*</span></Label>
                  <Select value={formData.to_wallet_id} onValueChange={(value) => handleInputChange('to_wallet_id', value)}>
                    <SelectTrigger className={errors.to_wallet_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Pilih dompet tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableToWallets.map((wallet) => {
                        const WalletIcon = getWalletIcon(wallet.type, wallet.name);
                        return (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            <div className="flex items-center space-x-2">
                              <WalletIcon className="h-4 w-4" />
                              <span>{wallet.name}</span>
                              <span className="text-sm text-gray-500">
                                Rp {wallet.balance?.toLocaleString('id-ID') || '0'}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.to_wallet_id && <p className="text-sm text-red-500">{errors.to_wallet_id}</p>}
                </div>
              )}

              {/* Category (not for transfer) */}
              {formData.type !== 'transfer' && (
                <div className="space-y-2">
                  <Label>Kategori <span className="text-red-500">*</span></Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                    <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color || '#6B7280' }}
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                </div>
              )}

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Waktu</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label>Bukti Transaksi (Opsional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {receiptPreview ? (
                    <div className="relative">
                      <img 
                        src={receiptPreview} 
                        alt="Receipt preview" 
                        className="w-full max-h-48 object-contain rounded"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={removeReceipt}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload foto bukti transaksi</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="hidden"
                        id="receipt-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('receipt-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Pilih File
                      </Button>
                    </div>
                  )}
                </div>
                {errors.receipt && <p className="text-sm text-red-500">{errors.receipt}</p>}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Catatan (Opsional)</Label>
                <Textarea
                  placeholder="Tambahkan catatan atau keterangan tambahan..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/transactions')}
                  disabled={createTransaction.isPending}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  disabled={createTransaction.isPending}
                >
                  {createTransaction.isPending ? 'Menyimpan...' : 'Simpan Transaksi'}
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
