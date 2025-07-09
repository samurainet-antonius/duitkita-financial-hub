
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  FileText, 
  HelpCircle, 
  Heart,
  LogOut,
  ChevronRight,
  Smartphone,
  Mail,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import TermsModal from "@/components/TermsModal";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    transactions: true,
    reports: true
  });
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('duitkita_logged_in');
    localStorage.removeItem('duitkita_remember');
    localStorage.removeItem('duitkita_user');
    
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari DuitKita.",
    });
    
    navigate('/');
  };

  const menuItems = [
    {
      section: "Akun",
      items: [
        {
          icon: User,
          title: "Edit Profile",
          description: "Ubah data personal Anda",
          action: () => navigate('/edit-profile')
        },
        {
          icon: Lock,
          title: "Ubah Password",
          description: "Ganti password akun",
          action: () => navigate('/change-password')
        }
      ]
    },
    {
      section: "Notifikasi",
      items: [
        {
          icon: Bell,
          title: "Push Notification",
          description: "Notifikasi dari aplikasi",
          type: "switch",
          value: notifications.push,
          onChange: (checked) => setNotifications(prev => ({ ...prev, push: checked }))
        },
        {
          icon: Mail,
          title: "Email Notification",
          description: "Notifikasi via email",
          type: "switch",
          value: notifications.email,
          onChange: (checked) => setNotifications(prev => ({ ...prev, email: checked }))
        },
        {
          icon: Smartphone,
          title: "Notif Transaksi",
          description: "Pemberitahuan setiap transaksi",
          type: "switch",
          value: notifications.transactions,
          onChange: (checked) => setNotifications(prev => ({ ...prev, transactions: checked }))
        }
      ]
    },
    {
      section: "Keamanan & Privasi",
      items: [
        {
          icon: Shield,
          title: "Keamanan Akun",
          description: "Two-factor authentication",
          action: () => toast({ title: "Coming Soon", description: "Fitur ini akan segera hadir!" })
        },
        {
          icon: FileText,
          title: "Kebijakan Privasi",
          description: "Baca kebijakan privasi kami",
          action: () => setShowPrivacyModal(true)
        },
        {
          icon: FileText,
          title: "Syarat & Ketentuan",
          description: "Baca syarat dan ketentuan",
          action: () => setShowTermsModal(true)
        }
      ]
    },
    {
      section: "Lainnya",
      items: [
        {
          icon: Download,
          title: "Export Data",
          description: "Download data keuangan Anda",
          action: () => toast({ title: "Export Dimulai", description: "Data akan dikirim via email dalam beberapa menit." })
        },
        {
          icon: HelpCircle,
          title: "Bantuan",
          description: "FAQ dan customer support",
          action: () => toast({ title: "Bantuan", description: "Hubungi kami di support@duitkita.com" })
        },
        {
          icon: Heart,
          title: "Donasi",
          description: "Dukung pengembangan DuitKita",
          action: () => toast({ title: "Terima Kasih!", description: "Dukungan Anda sangat berarti bagi kami ❤️" })
        }
      ]
    }
  ];

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
            <p className="text-emerald-100 text-sm">Kelola akun dan preferensi</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.section}</h2>
            <Card>
              <CardContent className="p-0">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div key={itemIndex}>
                      <div 
                        className={`flex items-center justify-between p-4 ${
                          item.type === 'switch' ? '' : 'hover:bg-gray-50 cursor-pointer'
                        } transition-colors`}
                        onClick={item.type !== 'switch' ? item.action : undefined}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Icon className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        
                        {item.type === 'switch' ? (
                          <Switch
                            checked={item.value}
                            onCheckedChange={item.onChange}
                          />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      {itemIndex < section.items.length - 1 && (
                        <div className="border-t border-gray-100 ml-16" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        ))}

        {/* App Info */}
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h3 className="font-semibold text-gray-900">DuitKita</h3>
            <p className="text-sm text-gray-500">Version 1.0.0</p>
            <p className="text-xs text-gray-400">
              © 2024 DuitKita. All rights reserved.
            </p>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar dari Akun
        </Button>
      </div>

      {/* Modals */}
      <PrivacyPolicyModal 
        open={showPrivacyModal} 
        onOpenChange={setShowPrivacyModal} 
      />
      <TermsModal 
        open={showTermsModal} 
        onOpenChange={setShowTermsModal} 
      />

      <BottomNavigation />
    </div>
  );
};

export default Settings;
