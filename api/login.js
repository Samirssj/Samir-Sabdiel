export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method Not Allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { usuario, password } = await req.json();

    if (usuario === 'samirssj' && password === 'samir_0800') {
      return new Response(
        JSON.stringify({ success: true, message: '✅ Login exitoso' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: '❌ Error de autenticación' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: '❌ Error procesando la solicitud' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
