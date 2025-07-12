
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Download, 
  Trash2, 
  LogOut,
  Shield,
  HelpCircle,
  Moon,
  Sun,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications, useUpdateNotifications } from "@/hooks/useNotifications";
import { useExportData } from "@/hooks/useExportData";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { useTheme } from "@/contexts/ThemeContext";
import BottomNavigation from "@/components/BottomNavigation";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: notifications } = useNotifications();
  const updateNotifications = useUpdateNotifications();
  const { exportData } = useExportData();
  const deleteAccount = useDeleteAccount();
  const { theme, setTheme, actualTheme } = useTheme();
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleExport = async (type: 'wallets' | 'transactions' | 'all') => {
    setExportLoading(type);
    try {
      await exportData(type, 'csv');
    } finally {
      setExportLoading(null);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    if (notifications) {
      updateNotifications.mutate({
        [key]: value
      });
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan dan semua data akan dihapus secara permanen.')) {
      deleteAccount.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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
            <h1 className="text-lg font-semibold">Pengaturan</h1>
            <p className="text-emerald-100 text-sm">Kelola preferensi akun Anda</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profil</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Kelola Profil</p>
                <p className="text-sm text-gray-500">Edit informasi personal Anda</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                Edit
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ubah Password</p>
                <p className="text-sm text-gray-500">Perbarui kata sandi akun</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/change-password')}>
                Ubah
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Kelola Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Semua Data</p>
                <p className="text-sm text-gray-500">Download semua dompet dan transaksi</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleExport('all')}
                disabled={exportLoading === 'all'}
              >
                {exportLoading === 'all' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Dompet</p>
                <p className="text-sm text-gray-500">Download data dompet saja</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleExport('wallets')}
                disabled={exportLoading === 'wallets'}
              >
                {exportLoading === 'wallets' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Transaksi</p>
                <p className="text-sm text-gray-500">Download data transaksi saja</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleExport('transactions')}
                disabled={exportLoading === 'transactions'}
              >
                {exportLoading === 'transactions' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Bantuan & Dukungan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">FAQ</p>
                <p className="text-sm text-gray-500">Pertanyaan yang sering diajukan</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/faq')}>
                Lihat
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Kontak Support</p>
                <p className="text-sm text-gray-500">Hubungi tim dukungan kami</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/contact-support')}>
                Kontak
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Privacy Policy</p>
                <p className="text-sm text-gray-500">Kebijakan privasi aplikasi</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/privacy-policy')}>
                Baca
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Akun</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600">Hapus Akun</p>
                <p className="text-sm text-gray-500">Hapus akun dan semua data secara permanen</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteAccount}
                disabled={deleteAccount.isPending}
              >
                {deleteAccount.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Hapus
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar dari Akun
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
