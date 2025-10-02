import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, TrendingUp, Shield, Zap, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  const features = [{
    icon: Users,
    title: "Comunidade Engajada",
    description: "Conecte-se com seus apoiadores e crie uma comunidade forte"
  }, {
    icon: TrendingUp,
    title: "Crescimento Sustentável",
    description: "Receba apoio recorrente e previsível para seus projetos"
  }, {
    icon: Shield,
    title: "Pagamentos Seguros",
    description: "Sistema de pagamento confiável com Pix, cartão e boleto"
  }, {
    icon: Zap,
    title: "Fácil de Usar",
    description: "Crie e gerencie suas campanhas em minutos"
  }];
  const testimonials = [{
    name: "Maria Silva",
    role: "Criadora de Conteúdo",
    content: "O Dinamires mudou completamente minha forma de trabalhar. Agora posso focar no que amo fazer!"
  }, {
    name: "João Santos",
    role: "Podcaster",
    content: "A plataforma é intuitiva e meus apoiadores adoram os benefícios exclusivos."
  }, {
    name: "Ana Costa",
    role: "Artista Digital",
    content: "Finalmente consegui monetizar minha arte de forma sustentável. Recomendo!"
  }];
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-hero rounded-3xl mb-6 glow-primary animate-scale-in">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 bg-gradient-hero bg-clip-text text-zinc-700">
              Apoie Criadores.<br />Receba Conteúdo Exclusivo.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Dinamires conecta criadores apaixonados com apoiadores que acreditam no seu trabalho.
              Crie sua campanha e comece a receber apoio recorrente hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <Button size="lg" className="text-lg px-8 glow-primary" onClick={() => navigate("/auth")}>
                Começar Agora
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate("/dashboard")}>
                Explorar Campanhas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Por que escolher o Dinamires?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para construir uma relação duradoura com seus apoiadores
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <Card key={index} className="glass-card hover-scale animate-fade-in" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Criadores que confiam em nós
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja o que nossos criadores têm a dizer
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => <Card key={index} className="glass-card animate-fade-in" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <CardDescription className="text-base">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative">
          <Card className="glass-card max-w-3xl mx-auto text-center p-8">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-heading mb-4">
                Pronto para começar sua jornada?
              </CardTitle>
              <CardDescription className="text-lg">
                Junte-se a centenas de criadores que já estão construindo sua comunidade no Dinamires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="text-lg px-12 glow-primary" onClick={() => navigate("/auth")}>
                Criar Minha Campanha
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Dinamires. Todos os direitos reservados.</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <a href="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;