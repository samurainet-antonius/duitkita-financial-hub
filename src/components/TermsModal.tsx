
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsModal = ({ open, onOpenChange }: TermsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Syarat & Ketentuan DuitKita</DialogTitle>
          <DialogDescription>
            Terakhir diperbarui: 9 Januari 2024
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-gray-700">
            <section>
              <h3 className="font-semibold text-gray-900 mb-2">1. Penerimaan Syarat</h3>
              <p>
                Dengan menggunakan aplikasi DuitKita, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan syarat ini, mohon berhenti menggunakan aplikasi.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">2. Deskripsi Layanan</h3>
              <p>
                DuitKita adalah aplikasi manajemen keuangan personal yang membantu pengguna:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Mencatat dan mengkategorikan transaksi keuangan</li>
                <li>Melacak pengeluaran dan pemasukan</li>
                <li>Menganalisis pola keuangan dengan grafik dan laporan</li>
                <li>Mengelola multiple akun/dompet</li>
                <li>Berbagi data keuangan dengan pasangan (opsional)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">3. Akun Pengguna</h3>
              <p>
                Untuk menggunakan DuitKita, Anda harus:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Berusia minimal 18 tahun atau memiliki izin wali</li>
                <li>Memberikan informasi yang akurat dan lengkap</li>
                <li>Menjaga kerahasiaan password dan keamanan akun</li>
                <li>Bertanggung jawab atas semua aktivitas dalam akun Anda</li>
                <li>Segera memberitahu kami jika terjadi penggunaan yang tidak sah</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">4. Penggunaan yang Dilarang</h3>
              <p>
                Anda dilarang untuk:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Menggunakan aplikasi untuk tujuan ilegal atau penipuan</li>
                <li>Mengganggu atau merusak infrastruktur aplikasi</li>
                <li>Mengakses data pengguna lain tanpa izin</li>
                <li>Menyalahgunakan fitur berbagi untuk menyebarkan informasi palsu</li>
                <li>Melakukan reverse engineering atau modifikasi aplikasi</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">5. Data dan Privasi</h3>
              <p>
                Dengan menggunakan DuitKita, Anda memahami bahwa:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Data keuangan yang Anda input akan disimpan secara aman</li>
                <li>Kami tidak mengakses informasi rekening bank aktual Anda</li>
                <li>Data hanya digunakan untuk menyediakan layanan aplikasi</li>
                <li>Anda dapat menghapus data kapan saja</li>
                <li>Berbagi data dengan pasangan adalah pilihan opsional</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">6. Ketersediaan Layanan</h3>
              <p>
                Kami berusaha menyediakan layanan 24/7, namun tidak dapat menjamin:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Ketersediaan layanan tanpa gangguan</li>
                <li>Akurasi 100% dari fitur analisis otomatis</li>
                <li>Kompatibilitas dengan semua perangkat</li>
                <li>Integrasi dengan semua bank atau layanan keuangan</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">7. Pembayaran dan Berlangganan</h3>
              <p>
                Untuk fitur premium:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Pembayaran akan ditagih sesuai paket yang dipilih</li>
                <li>Perpanjangan otomatis kecuali dibatalkan</li>
                <li>Refund tersedia sesuai kebijakan yang berlaku</li>
                <li>Akses premium berakhir jika pembayaran gagal</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">8. Batasan Tanggung Jawab</h3>
              <p>
                DuitKita tidak bertanggung jawab atas:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Keputusan keuangan yang dibuat berdasarkan data aplikasi</li>
                <li>Kehilangan data akibat kelalaian pengguna</li>
                <li>Kerugian finansial akibat penggunaan aplikasi</li>
                <li>Gangguan layanan di luar kendali kami</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">9. Perubahan Syarat</h3>
              <p>
                Kami berhak mengubah syarat dan ketentuan ini dengan pemberitahuan minimal 30 hari sebelumnya. Penggunaan berkelanjutan setelah perubahan dianggap sebagai persetujuan.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">10. Penghentian Layanan</h3>
              <p>
                Kami dapat menghentikan akses Anda jika:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Melanggar syarat dan ketentuan</li>
                <li>Menggunakan layanan untuk tujuan ilegal</li>
                <li>Tidak membayar biaya berlangganan</li>
                <li>Mengganggu pengguna lain</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">11. Hukum yang Berlaku</h3>
              <p>
                Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui pengadilan yang berwenang di Jakarta.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">12. Kontak</h3>
              <p>
                Jika ada pertanyaan tentang syarat dan ketentuan, hubungi kami di:
              </p>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> legal@duitkita.com</p>
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

export default TermsModal;
