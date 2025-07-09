
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyPolicyModal = ({ open, onOpenChange }: PrivacyPolicyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Kebijakan Privasi DuitKita</DialogTitle>
          <DialogDescription>
            Terakhir diperbarui: 9 Januari 2024
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-gray-700">
            <section>
              <h3 className="font-semibold text-gray-900 mb-2">1. Informasi yang Kami Kumpulkan</h3>
              <p>
                Kami mengumpulkan informasi yang Anda berikan kepada kami secara langsung, seperti:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Nama lengkap dan informasi kontak</li>
                <li>Data transaksi keuangan yang Anda input</li>
                <li>Informasi akun dan preferensi aplikasi</li>
                <li>Data penggunaan aplikasi untuk meningkatkan layanan</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">2. Bagaimana Kami Menggunakan Informasi</h3>
              <p>
                Informasi yang kami kumpulkan digunakan untuk:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Menyediakan dan memelihara layanan DuitKita</li>
                <li>Memberikan analisis dan wawasan keuangan personal</li>
                <li>Mengirimkan notifikasi terkait aktivitas akun</li>
                <li>Meningkatkan keamanan dan mencegah penipuan</li>
                <li>Mengembangkan fitur baru dan meningkatkan aplikasi</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">3. Keamanan Data</h3>
              <p>
                Kami menerapkan langkah-langkah keamanan tingkat bank untuk melindungi data Anda:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Enkripsi end-to-end untuk semua data sensitif</li>
                <li>Autentikasi dua faktor untuk keamanan ekstra</li>
                <li>Monitoring keamanan 24/7</li>
                <li>Audit keamanan rutin oleh pihak ketiga</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">4. Berbagi Informasi</h3>
              <p>
                Kami tidak akan menjual, menyewakan, atau membagikan informasi personal Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Ketika diwajibkan oleh hukum</li>
                <li>Untuk melindungi hak dan keamanan pengguna</li>
                <li>Dengan penyedia layanan terpercaya untuk operasional aplikasi</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">5. Hak Pengguna</h3>
              <p>Anda memiliki hak untuk:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Mengakses dan memperbarui informasi personal</li>
                <li>Menghapus akun dan data terkait</li>
                <li>Membatasi pemrosesan data tertentu</li>
                <li>Mengekspor data dalam format yang dapat dibaca</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">6. Cookies dan Teknologi Pelacakan</h3>
              <p>
                Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman pengguna, menganalisis penggunaan aplikasi, dan menyediakan fitur yang dipersonalisasi.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">7. Perubahan Kebijakan</h3>
              <p>
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan dikomunikasikan melalui aplikasi atau email, dan berlaku efektif setelah dipublikasikan.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">8. Hubungi Kami</h3>
              <p>
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di:
              </p>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> privacy@duitkita.com</p>
                <p><strong>Alamat:</strong> Jakarta, Indonesia</p>
                <p><strong>WhatsApp:</strong> +62 812-3456-7890</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
