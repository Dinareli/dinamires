import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlanCardProps {
  name: string;
  description: string | null;
  price: number;
  benefits: string[] | null;
}

export const PlanCard = ({ name, description, price, benefits }: PlanCardProps) => {
  const { toast } = useToast();

  const handleSupport = () => {
    toast({
      title: "Em breve",
      description: "Sistema de apoio será implementado em breve!",
    });
  };

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        {description && (
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(Number(price))}
          </span>
          <span className="text-muted-foreground">/mês</span>
        </div>
        
        {benefits && benefits.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Benefícios:</p>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSupport} className="w-full" size="lg">
          Apoiar com este plano
        </Button>
      </CardFooter>
    </Card>
  );
};
