
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileX } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8 text-center space-y-6">
          {/* 404 Icon */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileX className="h-12 w-12 text-gray-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">!</span>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
            <h2 className="text-xl font-semibold text-gray-700">Halaman Tidak Ditemukan</h2>
            <p className="text-gray-500 text-sm">
              Maaf, halaman yang Anda cari tidak dapat ditemukan atau mungkin telah dipindahkan.
            </p>
          </div>

          {/* Current Path */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Path yang dicoba:</p>
            <code className="text-sm text-gray-600 font-mono break-all">
              {location.pathname}
            </code>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              size="lg"
            >
              <Home className="h-4 w-4 mr-2" />
              {user ? 'Kembali ke Dashboard' : 'Kembali ke Beranda'}
            </Button>
            
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Halaman Sebelumnya
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3">Atau kunjungi:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="text-xs"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/wallets')}
                    className="text-xs"
                  >
                    Dompet
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/transactions')}
                    className="text-xs"
                  >
                    Transaksi
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="text-xs"
                  >
                    Masuk
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="text-xs"
                  >
                    Daftar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
