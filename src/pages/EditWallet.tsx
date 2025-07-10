
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building, Smartphone, Wallet, CreditCard } from "lucide-react";
import { useWallets, useUpdateWallet } from "@/hooks/useWallets";
import { validateRequired, validateAmount } from "@/utils/validation";

const EditWallet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: wallets = [] } = useWallets();
  const updateWallet = useUpdateWallet();
  
  const wallet = wallets.find(w => w.id === id);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
    accountNumber: "",
    description: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (wallet) {
      setFormData({
        name: wallet.name,
        type: wallet.type,
        balance: wallet.balance?.toString() || "0",
        accountNumber: wallet.account_number || "",
        description: ""
      });
    }
  }, [wallet]);

  const walletTypes = [
    { value: "bank", label: "Bank", icon: Building, color: "bg-blue-600" },
    { value: "e_wallet", label: "E-Wallet", icon: Smartphone, color: "bg-green-600" },
    { value: "cash", label: "Tunai", icon: Wallet, color: "bg-gray-600" },
    { value: "investment", label: "Investasi", icon: CreditCard, color: "bg-purple-600" }
  ];

  const bankOptions = [
    "BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga", "Danamon", "Permata", "OCBC NISP", "Maybank"
  ];

  const ewalletOptions = [
    "DANA", "GoPay", "OVO", "LinkAja", "ShopeePay", "Sakuku", "DOKU"
  ];

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Dompet tidak ditemukan</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/wallets')}
            >
              Kembali ke Dompet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const nameError = validateRequired(formData.name, "Nama dompet");
    if (nameError) newErrors.name = nameError;
    
    const typeError = validateRequired(formData.type, "Tipe dompet");
    if (typeError) newErrors.type = typeError;
    
    if (formData.balance) {
      const amountError = validateAmount(formData.balance);
      if (amountError) newErrors.balance = amountError;
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

  const handleBalanceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    handleInputChange('balance', numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await updateWallet.mutateAsync({
        id: wallet.id,
        updates: {
          name: formData.name,
          type: formData.type as "bank" | "cash" | "e_wallet" | "investment",
          balance: formData.balance ? parseFloat(formData.balance) : 0,
          account_number: formData.accountNumber || null,
          color: walletTypes.find(w => w.value === formData.type)?.color || '#3B82F6',
          icon: walletTypes.find(w => w.value === formData.type)?.icon.name || 'Wallet'
        }
      });

      navigate(`/wallet-detail/${wallet.id}`);
    } catch (error) {
      console.error('Error updating wallet:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getWalletOptions = () => {
    switch (formData.type) {
      case 'bank':
        return bankOptions;
      case 'e_wallet':
        return ewalletOptions;
      default:
        return [];
    }
  };

  const selectedWalletType = walletTypes.find(w => w.value === formData.type);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/wallet-detail/${wallet.id}`)}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Edit Dompet</h1>
            <p className="text-emerald-100 text-sm">Perbarui informasi dompet</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit {wallet.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Wallet Type Selection */}
              <div className="space-y-3">
                <Label className="text-lg font-medium">Tipe Dompet</Label>
                <div className="grid grid-cols-2 gap-3">
                  {walletTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('type', type.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.type === type.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <p className="font-medium text-gray-900">{type.label}</p>
                      </button>
                    );
                  })}
                </div>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
              </div>

              {formData.type && (
                <div className="space-y-2">
                  <Label>Nama Dompet <span className="text-red-500">*</span></Label>
                  {(formData.type === 'bank' || formData.type === 'e_wallet') ? (
                    <Select value={formData.name} onValueChange={(value) => handleInputChange('name', value)}>
                      <SelectTrigger className={errors.name ? 'border-red-500' : ''}>
                        <SelectValue placeholder={`Pilih ${formData.type === 'bank' ? 'bank' : 'e-wallet'}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {getWalletOptions().map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="Contoh: Dompet Harian, Kas Kecil"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                  )}
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
              )}

              {formData.type && formData.type !== 'cash' && (
                <div className="space-y-2">
                  <Label>
                    {formData.type === 'bank' ? 'Nomor Rekening' : 
                     formData.type === 'e_wallet' ? 'Nomor HP/ID' : 'Nomor Kartu'}
                  </Label>
                  <Input
                    placeholder={
                      formData.type === 'bank' ? 'Contoh: 1234567890' :
                      formData.type === 'e_wallet' ? 'Contoh: 081234567890' : 
                      'Contoh: 1234 **** **** 5678'
                    }
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Saldo Saat Ini</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-medium text-gray-600">
                    Rp
                  </span>
                  <Input
                    type="text"
                    placeholder="0"
                    value={formData.balance ? parseInt(formData.balance).toLocaleString('id-ID') : ''}
                    onChange={(e) => handleBalanceChange(e.target.value)}
                    className={`pl-10 text-lg ${errors.balance ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.balance && <p className="text-sm text-red-500">{errors.balance}</p>}
                <p className="text-sm text-gray-500">
                  Update saldo jika berbeda dengan saldo sebenarnya
                </p>
              </div>

              {formData.name && formData.type && (
                <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 text-emerald-800">Preview Dompet</h3>
                    <div className="flex items-center space-x-4">
                      {selectedWalletType && (
                        <div className={`w-12 h-12 ${selectedWalletType.color} rounded-xl flex items-center justify-center`}>
                          <selectedWalletType.icon className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-gray-900">{formData.name}</p>
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                            {selectedWalletType?.label}
                          </span>
                        </div>
                        {formData.accountNumber && (
                          <p className="text-sm text-gray-600">{formData.accountNumber}</p>
                        )}
                        <p className="text-lg font-bold text-emerald-600">
                          {formData.balance ? formatCurrency(parseInt(formData.balance)) : 'Rp 0'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(`/wallet-detail/${wallet.id}`)}
                  disabled={updateWallet.isPending}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  disabled={updateWallet.isPending}
                >
                  {updateWallet.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditWallet;
