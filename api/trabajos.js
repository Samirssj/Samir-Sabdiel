// /api/trabajos.js

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { categoria, curso, tecnologias, imagen, link } = req.body;

      // Aquí deberías guardar en tu BD (ejemplo MySQL, Mongo, etc.)
      // De momento solo devolvemos los datos para probar:
      return res.status(200).json({
        message: "Trabajo agregado correctamente",
        data: { categoria, curso, tecnologias, imagen, link },
      });
    } catch (error) {
      return res.status(500).json({ error: "Error al guardar el trabajo" });
    }
  }

  if (req.method === "GET") {
    // Aquí devuelves todos los trabajos
    return res.status(200).json({ message: "Lista de trabajos" });
  }

  if (req.method === "DELETE") {
    // Aquí borras un trabajo
    return res.status(200).json({ message: "Trabajo eliminado" });
  }

  // Si llega otro método no permitido
  return res.status(405).json({ error: "Método no permitido" });
}
