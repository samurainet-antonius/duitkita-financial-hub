
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Users, TrendingUp, Smartphone, Check, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const features = [
    {
      icon: Users,
      title: "Keuangan Bersama",
      description: "Kelola keuangan bersama pasangan dengan mudah dan transparan"
    },
    {
      icon: TrendingUp,
      title: "Analytics Lengkap",
      description: "Laporan dan grafik keuangan yang detail untuk pengambilan keputusan"
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description: "Data keuangan Anda tersimpan dengan enkripsi tingkat bank"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Akses dimana saja, kapan saja melalui smartphone Anda"
    }
  ];

  const pricing = [
    "Unlimited transaksi",
    "Analytics mendalam",
    "Sync dengan pasangan",
  ];

  const handleHomeClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      // Scroll to top if not logged in
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.reload(); // Refresh to update UI state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleHomeClick}>
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold text-gray-800">DuitKita</span>
          </div>
          <div className="flex space-x-3">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Masuk
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                >
                  Daftar Gratis
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Kelola <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">Duit</span> Bersama Lebih <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">Smart</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Platform catatan keuangan personal dan pasangan yang membantu Anda mencapai tujuan finansial bersama dengan analytics yang powerful.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button 
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-lg px-8 py-3"
                >
                  Buka Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg"
                    onClick={() => navigate('/register')}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-lg px-8 py-3"
                  >
                    Mulai Gratis Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {!user && (
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Gratis selamanya</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl p-1">
              <div className="bg-white rounded-3xl p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Saldo Total</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">Rp 15.750.000</div>
                  <div className="text-sm text-green-600">+12.5% dari bulan lalu</div>
                  
                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium">Gaji</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">+Rp 8.500.000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-xs">🛒</span>
                        </div>
                        <span className="text-sm font-medium">Belanja</span>
                      </div>
                      <span className="text-sm font-semibold text-red-600">-Rp 450.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Kenapa Pilih DuitKita?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solusi lengkap untuk mengelola keuangan personal dan bersama pasangan dengan mudah
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mx-auto">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Only show if user is not logged in */}
      {!user && (
        <section className="bg-gradient-to-br from-emerald-50 to-green-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Mulai Gratis, Tanpa Biaya Apapun
              </h2>
              <p className="text-lg text-gray-600">
                Nikmati semua fitur tanpa batasan
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <Card className="border-2 border-emerald-200 shadow-xl">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">Freemium</h3>
                    <div className="text-4xl font-bold text-emerald-600">
                      Rp 0
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pricing.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-emerald-500" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                    onClick={() => navigate('/register')}
                  >
                    Daftar Sekarang
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    Nikmati sepuasnya tanpa harus membayar.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-500 to-green-600 py-16">
        <div className="container mx-auto px-4 text-center text-white space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            {user ? 'Selamat Datang Kembali!' : 'Siap Mengelola Keuangan Lebih Smart?'}
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {user 
              ? 'Lanjutkan mengelola keuangan Anda dengan fitur-fitur canggih DuitKita'
              : 'Bergabung dengan ribuan pasangan yang sudah merasakan kemudahan mengelola keuangan bersama'
            }
          </p>
          <Button 
            size="lg"
            variant="secondary"
            className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-3"
            onClick={() => navigate(user ? '/dashboard' : '/register')}
          >
            {user ? 'Buka Dashboard' : 'Daftar Sekarang - Gratis!'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="text-xl font-bold">DuitKita</span>
              </div>
              <p className="text-gray-400 text-sm">
                Platform terpercaya untuk mengelola keuangan personal dan pasangan
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Produk</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Catatan Keuangan</div>
                <div>Analytics</div>
                <div>Multi Wallet</div>
                <div>Sync Pasangan</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Dukungan</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Help Center</div>
                <div>Kontak Kami</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Donasi</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Privacy Policy</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 DuitKita. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
