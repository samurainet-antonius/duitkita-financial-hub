
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const ContactSupport = () => {
  const navigate = useNavigate();

  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@duitkita.com?subject=Bantuan DuitKita';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Kontak Support</h1>
            <p className="text-emerald-100 text-sm">Hubungi tim dukungan kami</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Email Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Kirim email kepada tim support kami untuk bantuan teknis atau pertanyaan umum.
            </p>
            <Button onClick={handleEmailSupport} className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Kirim Email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Jam Operasional</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-600">
              <p><strong>Senin - Jumat:</strong> 09:00 - 17:00 WIB</p>
              <p><strong>Sabtu:</strong> 09:00 - 15:00 WIB</p>
              <p><strong>Minggu:</strong> Libur</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tips Sebelum Menghubungi Support</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Cek FAQ terlebih dahulu untuk solusi cepat</li>
              <li>Siapkan detail masalah yang Anda alami</li>
              <li>Screenshot error jika ada</li>
              <li>Informasi perangkat yang digunakan</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ContactSupport;
