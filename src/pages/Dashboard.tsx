import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Plus, Search, LogOut } from "lucide-react";
import { toast } from "sonner";
import MyCampaigns from "@/components/dashboard/MyCampaigns";
import BrowseCampaigns from "@/components/dashboard/BrowseCampaigns";
import MySupport from "@/components/dashboard/MySupport";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  const userInitials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0].toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold">Dinamires</h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-hero text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || "Usuário"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="my-campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="my-campaigns">Minhas Campanhas</TabsTrigger>
            <TabsTrigger value="browse">
              <Search className="w-4 h-4 mr-2" />
              Explorar
            </TabsTrigger>
            <TabsTrigger value="my-support">Meus Apoios</TabsTrigger>
          </TabsList>

          <TabsContent value="my-campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-heading font-bold">Minhas Campanhas</h2>
                <p className="text-muted-foreground">Gerencie suas campanhas de apoio</p>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Campanha
              </Button>
            </div>
            <MyCampaigns userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">Explorar Campanhas</h2>
              <p className="text-muted-foreground">Descubra criadores incríveis</p>
            </div>
            <BrowseCampaigns />
          </TabsContent>

          <TabsContent value="my-support" className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">Meus Apoios</h2>
              <p className="text-muted-foreground">Campanhas que você apoia</p>
            </div>
            <MySupport userId={user?.id || ""} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
