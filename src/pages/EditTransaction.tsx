
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useTransactions, useUpdateTransaction } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";
import { useCategories } from "@/hooks/useCategories";
import { validateRequired, validateAmount } from "@/utils/validation";
import { supabase } from "@/integrations/supabase/client";

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: transactions = [] } = useTransactions();
  const { data: wallets = [] } = useWallets();
  const { data: categories = [] } = useCategories();
  const updateTransaction = useUpdateTransaction();
  
  const transaction = transactions.find(t => t.id === id);
  
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    description: "",
    categoryId: "",
    walletId: "",
    toWalletId: "",
    date: "",
    time: "",
    notes: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [currentReceiptUrl, setCurrentReceiptUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description,
        categoryId: transaction.category_id || "",
        walletId: transaction.wallet_id || "",
        toWalletId: transaction.to_wallet_id || "",
        date: transaction.date,
        time: transaction.time,
        notes: transaction.notes || ""
      });
      setCurrentReceiptUrl(transaction.receipt_url || "");
    }
  }, [transaction]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const typeError = validateRequired(formData.type, "Tipe transaksi");
    if (typeError) newErrors.type = typeError;
    
    const amountError = validateAmount(formData.amount);
    if (amountError) newErrors.amount = amountError;
    
    const descError = validateRequired(formData.description, "Deskripsi");
    if (descError) newErrors.description = descError;
    
    const walletError = validateRequired(formData.walletId, "Dompet");
    if (walletError) newErrors.walletId = walletError;
    
    if (formData.type === 'transfer') {
      const toWalletError = validateRequired(formData.toWalletId, "Dompet tujuan");
      if (toWalletError) newErrors.toWalletId = toWalletError;
      
      if (formData.walletId === formData.toWalletId) {
        newErrors.toWalletId = "Dompet tujuan harus berbeda dengan dompet asal";
      }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }
      
      setReceiptFile(file);
    }
  };

  const uploadReceipt = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('transaction-receipts')
        .upload(fileName, file);

      if (error) throw error;
      return data.path;
    } catch (error) {
      console.error('Error uploading receipt:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      let receiptPath = currentReceiptUrl;
      
      if (receiptFile) {
        const uploadedPath = await uploadReceipt(receiptFile);
        if (uploadedPath) {
          receiptPath = uploadedPath;
        }
      }

      const updateData: any = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category_id: formData.categoryId || null,
        wallet_id: formData.walletId || null,
        to_wallet_id: formData.type === 'transfer' ? formData.toWalletId : null,
        date: formData.date,
        time: formData.time,
        notes: formData.notes || null
      };

      if (formData.type === 'expense' && receiptPath) {
        updateData.receipt_url = receiptPath;
      }

      await updateTransaction.mutateAsync({
        id: transaction.id,
        updates: updateData
      });

      navigate(`/transaction-detail/${transaction.id}`);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const availableWallets = wallets.filter(w => w.id !== formData.walletId);
  const filteredCategories = categories.filter(c => 
    formData.type === 'transfer' ? c.type === 'transfer' : c.type !== 'transfer'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/transaction-detail/${transaction.id}`)}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Edit Transaksi</h1>
            <p className="text-emerald-100 text-sm">Perbarui informasi transaksi</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type */}
              <div className="space-y-3">
                <Label className="text-lg font-medium">Tipe Transaksi</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'income', label: 'Pemasukan', color: 'bg-green-600' },
                    { value: 'expense', label: 'Pengeluaran', color: 'bg-red-600' },
                    { value: 'transfer', label: 'Transfer', color: 'bg-blue-600' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('type', type.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.type === type.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 ${type.color} rounded-lg mx-auto mb-2`}></div>
                      <p className="font-medium text-sm">{type.label}</p>
                    </button>
                  ))}
                </div>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
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

              {/* Wallet Selection */}
              <div className="space-y-2">
                <Label>
                  {formData.type === 'transfer' ? 'Dari Dompet' : 'Dompet'} 
                  <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.walletId} onValueChange={(value) => handleInputChange('walletId', value)}>
                  <SelectTrigger className={errors.walletId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih dompet" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        {wallet.name} - {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(wallet.balance || 0)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.walletId && <p className="text-sm text-red-500">{errors.walletId}</p>}
              </div>

              {/* To Wallet for Transfer */}
              {formData.type === 'transfer' && (
                <div className="space-y-2">
                  <Label>Ke Dompet <span className="text-red-500">*</span></Label>
                  <Select value={formData.toWalletId} onValueChange={(value) => handleInputChange('toWalletId', value)}>
                    <SelectTrigger className={errors.toWalletId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Pilih dompet tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.name} - {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(wallet.balance || 0)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.toWalletId && <p className="text-sm text-red-500">{errors.toWalletId}</p>}
                </div>
              )}

              {/* Category */}
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Deskripsi <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Contoh: Makan siang, gaji bulanan, dll"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

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

              {/* Receipt Upload for Expense */}
              {formData.type === 'expense' && (
                <div className="space-y-2">
                  <Label>Bukti Pembayaran (Opsional)</Label>
                  {currentReceiptUrl && !receiptFile && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Bukti saat ini:</p>
                      <img 
                        src={supabase.storage.from('transaction-receipts').getPublicUrl(currentReceiptUrl).data.publicUrl}
                        alt="Current receipt"
                        className="w-32 h-32 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setCurrentReceiptUrl("")}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hapus Bukti
                      </Button>
                    </div>
                  )}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label htmlFor="receipt-upload" className="cursor-pointer">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {receiptFile ? receiptFile.name : 'Klik untuk upload bukti pembayaran'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG maksimal 5MB</p>
                      </div>
                    </label>
                  </div>
                  {receiptFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setReceiptFile(null)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Batalkan Upload
                    </Button>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label>Catatan (Opsional)</Label>
                <Textarea
                  placeholder="Tambahkan catatan..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(`/transaction-detail/${transaction.id}`)}
                  disabled={updateTransaction.isPending || uploading}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  disabled={updateTransaction.isPending || uploading}
                >
                  {(updateTransaction.isPending || uploading) ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTransaction;
