const FREE_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'google/gemma-2-9b-it:free'
];

export async function callAI(systemPrompt: string, userMessage: string, requireJson = false) {
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://summer-jarvis.vercel.app',
          'X-Title': 'J.A.R.V.I.S. Goal Command Center'
        },
        body: JSON.stringify({
          model: FREE_MODELS[0],
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          response_format: requireJson ? { type: 'json_object' } : undefined,
          max_tokens: 2000,
          temperature: 0.3
        })
      });
      if (response.ok) return response.json();
    } catch {
      console.warn('OpenRouter failed, trying NVIDIA NIM...');
    }
  }

  if (process.env.NVIDIA_NIM_API_KEY) {
    const nimResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    });
    return nimResponse.json();
  }

  throw new Error('No AI provider configured');
}

export function extractAIContent(payload: unknown) {
  const data = payload as { choices?: Array<{ message?: { content?: string }; delta?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? data.choices?.[0]?.delta?.content ?? '';
}
