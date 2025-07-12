
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

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
            <h1 className="text-lg font-semibold">Kebijakan Privasi</h1>
            <p className="text-emerald-100 text-sm">Ketentuan dan kebijakan privasi aplikasi</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Pengumpulan Informasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Nama lengkap dan informasi kontak</li>
              <li>Data transaksi dan keuangan yang Anda input</li>
              <li>Informasi penggunaan aplikasi</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Penggunaan Informasi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Informasi yang kami kumpulkan digunakan untuk:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>Menyediakan dan memelihara layanan aplikasi</li>
              <li>Meningkatkan pengalaman pengguna</li>
              <li>Mengirim notifikasi penting terkait akun Anda</li>
              <li>Memberikan dukungan teknis</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keamanan Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Kami menerapkan langkah-langkah keamanan yang tepat untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Data Anda dienkripsi dan disimpan dengan aman.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hak Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Anda memiliki hak untuk:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>Mengakses data pribadi Anda</li>
              <li>Memperbarui atau mengoreksi informasi</li>
              <li>Menghapus akun dan data Anda</li>
              <li>Mengekspor data Anda</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PrivacyPolicy;
