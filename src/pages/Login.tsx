
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail, validateRequired } from "@/utils/validation";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validateRequired(formData.password, "Password");
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    setLoading(false);
    
    if (!error) {
      if (rememberMe) {
        localStorage.setItem('duitkita_remember', 'true');
      }
      navigate('/dashboard');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Masuk ke DuitKita</h1>
            <p className="text-gray-600">Selamat datang kembali!</p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-gray-800">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} focus:border-emerald-500`}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} focus:border-emerald-500 pr-10`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="border-gray-300"
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Ingat saya
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Lupa password?
                </button>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-2.5"
              >
                {loading ? "Masuk..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <button
                  onClick={() => navigate('/register')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                >
                  Daftar disini
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Login;
