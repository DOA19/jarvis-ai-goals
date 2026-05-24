const FREE_MODELS = [
  'openai/gpt-oss-20b:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'google/gemma-2-9b-it:free'
];

export async function callAI(systemPrompt: string, userMessage: string, requireJson = false) {
  if (process.env.OPENROUTER_API_KEY) {
    const modelCandidates = [process.env.OPENROUTER_MODEL, ...FREE_MODELS].filter(
      (value): value is string => Boolean(value)
    );
    const seen = new Set<string>();
    let lastError = 'Unknown OpenRouter failure';

    for (const model of modelCandidates) {
      if (seen.has(model)) continue;
      seen.add(model);

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
            'X-Title': 'J.A.R.V.I.S. Goal Command Center'
          },
          body: JSON.stringify({
            model,
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

        const errorText = await response.text();
        lastError = `${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`;
      } catch (error) {
        lastError = error instanceof Error ? error.message : lastError;
      }
    }

    throw new Error(`OpenRouter request failed: ${lastError}`);
  }

  if (process.env.NVIDIA_NIM_API_KEY) {
    try {
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
      if (!nimResponse.ok) {
        const errorText = await nimResponse.text();
        throw new Error(`NVIDIA NIM request failed: ${nimResponse.status} ${nimResponse.statusText}${errorText ? ` - ${errorText}` : ''}`);
      }
      return nimResponse.json();
    } catch (error) {
      throw error instanceof Error ? error : new Error('NVIDIA NIM request failed');
    }
  }

  throw new Error('No AI provider configured');
}

export function extractAIContent(payload: unknown) {
  const data = payload as { choices?: Array<{ message?: { content?: string }; delta?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? data.choices?.[0]?.delta?.content ?? '';
}
