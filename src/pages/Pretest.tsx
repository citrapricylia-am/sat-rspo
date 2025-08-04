import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { PlayCircle, User, Mail, Phone, MapPin, UserCheck } from 'lucide-react';
import Layout from '@/components/Layout';

const Pretest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleStartAssessment = () => {
    navigate('/assessment/stage1');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border shadow-green">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Selamat Datang!</CardTitle>
              <CardDescription>
                Berikut adalah data diri Anda yang akan digunakan dalam assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="bg-gradient-secondary rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Data Diri
                </h3>
                
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                      <p className="font-medium">{user.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Alamat</p>
                      <p className="font-medium">{user.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <Badge variant="secondary" className="mt-1">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assessment Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Tentang Assessment</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Assessment terdiri dari 3 tahap: Eligibility Test, Milestone A, dan Milestone B</p>
                  <p>• Setiap tahap memiliki pertanyaan yang disesuaikan dengan role Anda</p>
                  <p>• Jawaban akan mempengaruhi pertanyaan di tahap selanjutnya</p>
                  <p>• Anda akan mendapat skor dan rekomendasi di setiap tahap</p>
                </div>
              </div>

              <Button 
                onClick={handleStartAssessment}
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg py-6"
                size="lg"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Mulai Mengerjakan Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Pretest;