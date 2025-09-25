export default function handler(req, res) {
  if (req.method === "GET") {
    // Lógica para obtener trabajos
    res.status(200).json({ trabajos: [] });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}