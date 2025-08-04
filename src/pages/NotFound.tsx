import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-border shadow-subtle text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
              <CardTitle className="text-3xl">404</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Oops! Halaman yang Anda cari tidak ditemukan.
              </p>
              <Button asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
