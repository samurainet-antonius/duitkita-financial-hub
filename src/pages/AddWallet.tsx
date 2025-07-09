
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building, Smartphone, Wallet, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AddWallet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
    accountNumber: "",
    description: ""
  });

  const walletTypes = [
    { value: "bank", label: "Bank", icon: Building, color: "bg-blue-600" },
    { value: "ewallet", label: "E-Wallet", icon: Smartphone, color: "bg-green-600" },
    { value: "cash", label: "Tunai", icon: Wallet, color: "bg-gray-600" },
    { value: "credit", label: "Kartu Kredit", icon: CreditCard, color: "bg-red-600" }
  ];

  const bankOptions = [
    "BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga", "Danamon", "Permata", "OCBC NISP", "Maybank"
  ];

  const ewalletOptions = [
    "DANA", "GoPay", "OVO", "LinkAja", "ShopeePay", "Sakuku", "DOKU"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBalanceChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      balance: numericValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast({
        title: "Error",
        description: "Mohon lengkapi nama dan tipe dompet.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Dompet Berhasil Ditambahkan!",
      description: `${formData.name} telah ditambahkan ke daftar dompet Anda.`,
    });

    navigate('/wallets');
  };

  const formatCurrency = (amount) => {
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
      case 'ewallet':
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
            onClick={() => navigate('/wallets')}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Tambah Dompet</h1>
            <p className="text-emerald-100 text-sm">Tambahkan akun keuangan baru</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Dompet Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Wallet Type Selection */}
              <div className="space-y-3">
                <Label className="text-lg font-medium">Pilih Tipe Dompet</Label>
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
              </div>

              {/* Wallet Name */}
              {formData.type && (
                <div className="space-y-2">
                  <Label>Nama Dompet <span className="text-red-500">*</span></Label>
                  {(formData.type === 'bank' || formData.type === 'ewallet') ? (
                    <Select value={formData.name} onValueChange={(value) => handleInputChange('name', value)}>
                      <SelectTrigger>
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
                    />
                  )}
                </div>
              )}

              {/* Account Number */}
              {formData.type && formData.type !== 'cash' && (
                <div className="space-y-2">
                  <Label>
                    {formData.type === 'bank' ? 'Nomor Rekening' : 
                     formData.type === 'ewallet' ? 'Nomor HP/ID' : 'Nomor Kartu'}
                  </Label>
                  <Input
                    placeholder={
                      formData.type === 'bank' ? 'Contoh: 1234567890' :
                      formData.type === 'ewallet' ? 'Contoh: 081234567890' : 
                      'Contoh: 1234 **** **** 5678'
                    }
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  />
                </div>
              )}

              {/* Initial Balance */}
              <div className="space-y-2">
                <Label>Saldo Awal</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-medium text-gray-600">
                    Rp
                  </span>
                  <Input
                    type="text"
                    placeholder="0"
                    value={formData.balance ? parseInt(formData.balance).toLocaleString('id-ID') : ''}
                    onChange={(e) => handleBalanceChange(e.target.value)}
                    className="pl-10 text-lg"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Masukkan saldo saat ini di akun tersebut
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Keterangan (Opsional)</Label>
                <Input
                  placeholder="Contoh: Rekening utama, dompet darurat"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              {/* Preview */}
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

              {/* Submit Buttons */}
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/wallets')}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                >
                  Simpan Dompet
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-4 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Pastikan saldo awal sesuai dengan saldo sebenarnya</li>
              <li>• Gunakan nama yang mudah dikenali</li>
              <li>• Anda dapat mengedit dompet kapan saja</li>
              <li>• Pisahkan dompet untuk tujuan yang berbeda</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddWallet;
