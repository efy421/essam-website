export default async (req) => {
    try {
      if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const body = await req.json();
      const email = (body?.email || "").trim();
  
      if (!email || !email.includes("@")) {
        return new Response(JSON.stringify({ error: "Invalid email" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const KIT_FORM_ID = process.env.KIT_FORM_ID;
      const KIT_API_KEY = process.env.KIT_API_KEY;
  
      if (!KIT_FORM_ID || !KIT_API_KEY) {
        return new Response(JSON.stringify({ error: "Missing server config" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const kitUrl = `https://api.kit.com/v3/forms/${KIT_FORM_ID}/subscribe`;
  
      const r = await fetch(kitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: KIT_API_KEY,
          email,
        }),
      });
  
      if (!r.ok) {
        const t = await r.text();
        return new Response(JSON.stringify({ error: "Kit request failed", details: t }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
  