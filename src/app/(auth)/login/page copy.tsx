import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Lado esquerdo (branding) */}
      <div className="flex flex-col items-center justify-center bg-background p-8 md:w-1/2">
        <div className="flex flex-col items-center gap-2">
          <div className="text-5xl text-primary">
            ⚙️
          </div>
          <h1 className="text-3xl font-bold text-primary">OFICINA</h1>
          <h2 className="text-2xl font-semibold text-foreground mt-4">Faça login</h2>
          <p className="hidden md:block text-mutedForeground mt-2">
            Bem-vindo à Oficina<br />
            Confiança e qualidade no serviço.
          </p>
        </div>
      </div>

      {/* Lado direito (formulário) */}
      <div className="flex flex-1 items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm space-y-6">
          <form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email" className="text-mutedForeground">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                className="bg-secondary text-foreground mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-mutedForeground">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                className="bg-secondary text-foreground mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primaryForeground hover:opacity-90 mt-4"
            >
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-mutedForeground hover:underline cursor-pointer">
            Esqueceu sua senha?
          </p>
        </div>
      </div>
    </div>
  );
}
