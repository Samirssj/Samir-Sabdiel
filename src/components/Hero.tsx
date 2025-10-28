import { ArrowDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToWorks = () => {
    const element = document.getElementById('works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen bg-transparent flex items-center justify-center section-padding pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl leading-tight">
            <span className="text-[#0040ff]">¡Bienvenido!</span>
            <br />
            <span className="text-foreground">Te presento mi blog Académico</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Estudiante de la Universidad Peruana Los Andes. 
            Comparto mis trabajos universitarios y conocimientos sobre programación y desarrollo web.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              onClick={scrollToWorks}
              size="lg"
              className="btn-primary-glow text-lg px-8 py-6 rounded-2xl font-semibold"
            >
              <Download className="mr-2 h-5 w-5" />
              Ver Trabajos
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-6 rounded-2xl font-semibold border-primary text-primary hover:bg-primary/10"
            >
              Conocer más
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;