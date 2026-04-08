module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'E-mail inválido' });
  }

  const SUBSTACK = process.env.SUBSTACK_PUBLICATION || 'oportaldopalestra';

  try {
    const response = await fetch(`https://${SUBSTACK}.substack.com/api/v1/free`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });

    // Substack returns 200 on success or already subscribed
    if (response.ok || response.status === 409) {
      return res.status(200).json({ ok: true });
    }

    // Still redirect to obrigado on any non-fatal status
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Substack subscribe error:', err);
    // Fail gracefully — send user to thank-you page anyway
    return res.status(200).json({ ok: true });
  }
}
