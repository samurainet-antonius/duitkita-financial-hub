
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
  Sun
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications, useUpdateNotifications } from "@/hooks/useNotifications";
import { useExportData } from "@/hooks/useExportData";
import BottomNavigation from "@/components/BottomNavigation";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: notifications } = useNotifications();
  const updateNotifications = useUpdateNotifications();
  const { exportData } = useExportData();
  const [theme, setTheme] = useState("light");

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleExport = (type: 'wallets' | 'transactions' | 'all') => {
    exportData(type, 'csv');
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    if (notifications) {
      updateNotifications.mutate({
        [key]: value
      });
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

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifikasi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-500">Terima notifikasi push di perangkat</p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications?.push_notifications ?? true}
                onCheckedChange={(checked) => handleNotificationChange('push_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Terima notifikasi melalui email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications?.email_notifications ?? false}
                onCheckedChange={(checked) => handleNotificationChange('email_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="transaction-notifications">Notifikasi Transaksi</Label>
                <p className="text-sm text-gray-500">Notifikasi untuk setiap transaksi baru</p>
              </div>
              <Switch
                id="transaction-notifications"
                checked={notifications?.transaction_notifications ?? true}
                onCheckedChange={(checked) => handleNotificationChange('transaction_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="shared-wallet-notifications">Notifikasi Dompet Bersama</Label>
                <p className="text-sm text-gray-500">Notifikasi dari dompet yang dibagikan</p>
              </div>
              <Switch
                id="shared-wallet-notifications"
                checked={notifications?.shared_wallet_notifications ?? true}
                onCheckedChange={(checked) => handleNotificationChange('shared_wallet_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="backup-notifications">Notifikasi Backup</Label>
                <p className="text-sm text-gray-500">Notifikasi untuk backup otomatis</p>
              </div>
              <Switch
                id="backup-notifications"
                checked={notifications?.backup_notifications ?? true}
                onCheckedChange={(checked) => handleNotificationChange('backup_notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span>Tampilan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label>Tema Aplikasi</Label>
                <p className="text-sm text-gray-500">Pilih tema yang Anda sukai</p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Terang</SelectItem>
                  <SelectItem value="dark">Gelap</SelectItem>
                  <SelectItem value="system">Sistem</SelectItem>
                </SelectContent>
              </Select>
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
              <Button variant="outline" onClick={() => handleExport('all')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Dompet</p>
                <p className="text-sm text-gray-500">Download data dompet saja</p>
              </div>
              <Button variant="outline" onClick={() => handleExport('wallets')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Transaksi</p>
                <p className="text-sm text-gray-500">Download data transaksi saja</p>
              </div>
              <Button variant="outline" onClick={() => handleExport('transactions')}>
                <Download className="h-4 w-4 mr-2" />
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
              <Button variant="outline">
                Lihat
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Kontak Support</p>
                <p className="text-sm text-gray-500">Hubungi tim dukungan kami</p>
              </div>
              <Button variant="outline">
                Kontak
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Privacy Policy</p>
                <p className="text-sm text-gray-500">Kebijakan privasi aplikasi</p>
              </div>
              <Button variant="outline">
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
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
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
