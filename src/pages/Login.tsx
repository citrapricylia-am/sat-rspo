import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LogIn } from 'lucide-react';
import Layout from '@/components/Layout';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang! Silakan lanjutkan ke pretest.",
        });
        navigate('/pretest');
      }
    } catch (error) {
      // Display the specific error message from AuthContext/API
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.';
      
      // Check if it's a timeout error and provide specific guidance
      if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
        toast({
          title: "Login Timeout",
          description: "Login memakan waktu terlalu lama. Silakan periksa koneksi internet Anda dan coba lagi.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login Gagal",
          description: errorMessage,
          variant: "destructive"
        });
      }
      
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-border shadow-green">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Masuk ke Akun Anda</CardTitle>
              <CardDescription>
                Silakan masuk untuk melanjutkan assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="nama@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Masukkan password"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Masuk
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Belum punya akun? </span>
                  <Link to="/register" className="text-primary hover:underline">
                    Daftar di sini
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;