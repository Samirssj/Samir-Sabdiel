import profileImage from "@/assets/profile-image.jpg";

const About = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-primary shadow-glow">
                <img 
                  src={profileImage}
                  alt="Rojas Tamara Samir Sabiel - Estudiante de Programación"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-4 rounded-full border border-primary/20 animate-pulse"></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-gradient">Acerca de mí</span>
            </h2>
            
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                ¡Hola! Soy <span className="text-primary font-semibold">Rojas Tamara Samir Sabiel</span>, 
                estudiante de la Universidad Peruana Los Andes, apasionado por la programación y el desarrollo tecnológico.
              </p>
              
              <p>
                En este blog comparto mis trabajos universitarios, proyectos de programación y herramientas 
                que utilizo en mi formación académica. Mi objetivo es crear un espacio donde otros estudiantes 
                puedan acceder libremente a recursos educativos y materiales de estudio.
              </p>
              
              <p>
                Especializado en desarrollo web, bases de datos y programación orientada a objetos. 
                Siempre en búsqueda de nuevas tecnologías y metodologías que enriquezcan mi aprendizaje.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-xl font-semibold text-primary mb-3">Áreas de interés:</h3>
              <div className="flex flex-wrap gap-3">
                {['Desarrollo Web', 'Bases de Datos', 'Java', 'PHP', 'JavaScript', 'Investigación'].map((skill) => (
                  <span 
                    key={skill}
                    className="px-4 py-2 bg-card border border-primary/20 rounded-xl text-sm font-medium hover:border-primary/40 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <p className="text-primary font-medium">
                💡 ¿Interesado en mis trabajos? Explora la sección de descargas o contacta conmigo para colaboraciones académicas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;