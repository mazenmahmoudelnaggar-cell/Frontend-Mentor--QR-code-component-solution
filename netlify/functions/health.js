export default async function handler(req, res) {
  return new Response(
    JSON.stringify({ status: "ok" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
