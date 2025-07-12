
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";

const FAQ = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "Bagaimana cara menambah dompet baru?",
      answer: "Buka halaman Dompet, lalu klik tombol '+' di pojok kanan bawah. Pilih jenis dompet dan isi informasi yang diperlukan."
    },
    {
      question: "Apakah data saya aman?",
      answer: "Ya, data Anda dienkripsi dan disimpan dengan aman. Kami menggunakan protokol keamanan tingkat enterprise untuk melindungi informasi Anda."
    },
    {
      question: "Bagaimana cara berbagi dompet dengan orang lain?",
      answer: "Buka detail dompet, klik 'Bagikan', lalu masukkan nama lengkap pengguna yang ingin Anda ajak berbagi dompet."
    },
    {
      question: "Bisakah saya mengekspor data transaksi?",
      answer: "Ya, Anda dapat mengekspor data melalui halaman Pengaturan. Pilih jenis data yang ingin diekspor (semua data, hanya dompet, atau hanya transaksi)."
    },
    {
      question: "Bagaimana cara mengubah kata sandi?",
      answer: "Buka Pengaturan > Profil > Ubah Password. Masukkan kata sandi lama dan kata sandi baru Anda."
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
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">FAQ</h1>
            <p className="text-emerald-100 text-sm">Pertanyaan yang Sering Diajukan</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {faqItems.map((item, index) => (
          <Card key={index}>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleItem(index)}
            >
              <CardTitle className="flex items-center justify-between text-base">
                <span>{item.question}</span>
                {openItems.includes(index) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
            {openItems.includes(index) && (
              <CardContent className="pt-0">
                <p className="text-gray-600">{item.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default FAQ;
