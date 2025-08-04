import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Award, Leaf } from 'lucide-react';
import Layout from '@/components/Layout';

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-green">
              <Leaf className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              SAT RSPO PADI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Self Assessment Tool untuk membantu petani dan manajer kelapa sawit 
              mengevaluasi praktik berkelanjutan sesuai standar RSPO
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-green">
              <Link to="/login">Masuk</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
              <Link to="/register">Daftar Sekarang</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-border shadow-subtle hover:shadow-green transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Assessment Bertahap</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Evaluasi komprehensif melalui 3 tahap: Eligibility Test, Milestone A, dan Milestone B
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border shadow-subtle hover:shadow-green transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Multi-Role Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Disesuaikan untuk kebutuhan Petani dan Manajer dengan pertanyaan yang relevan
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border shadow-subtle hover:shadow-green transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Hasil Terperinci</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Dapatkan skor, persentase, dan rekomendasi untuk meningkatkan praktik berkelanjutan
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="bg-gradient-secondary border-border shadow-subtle">
          <CardHeader>
            <CardTitle className="text-2xl text-center mb-4">Tentang RSPO</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription className="text-base max-w-3xl mx-auto">
              Roundtable on Sustainable Palm Oil (RSPO) adalah organisasi global yang mengembangkan 
              dan mengimplementasikan standar berkelanjutan untuk industri minyak kelapa sawit. 
              Tool ini membantu Anda mengevaluasi kesiapan untuk sertifikasi RSPO.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Home;