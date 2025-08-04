import { ReactNode } from 'react';
import { Leaf } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

const Layout = ({ children, showHeader = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background">
      {showHeader && (
        <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-subtle">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SAT RSPO PADI</h1>
                <p className="text-sm text-muted-foreground">Self Assessment Tool</p>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;