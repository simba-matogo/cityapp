import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpenRouterService {
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly API_KEY = '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';
  
  // CONFIRMED WORKING MODELS ON OPENROUTER:
  private readonly MODEL = 'mistralai/mixtral-8x7b-instruct'; // CONFIRMED WORKING - $0.24/$0.96 per 1M tokens
  
  // ALTERNATIVES (if needed):
  // private readonly MODEL = 'anthropic/claude-instant-1'; // May work - $0.00163/$0.00551 per 1K tokens
  // private readonly MODEL = 'gpt-3.5-turbo'; // NOT AVAILABLE on OpenRouter
  
  // NOTE: Mixtral was working before, so switching back to it
  // OpenRouter has limited model availability compared to other providers
  
  private readonly REFERER = 'http://localhost:4200'; // Change to your deployed site if needed
  private readonly TITLE = 'CityApp'; // Change to your app/site name if needed

  constructor() {}

  /**
   * Generate AI response using OpenRouter API (chat/completions)
   */
  async generateResponse(prompt: string, systemMessage?: string, userName?: string): Promise<string> {
    const headers = {
      'Authorization': `Bearer ${this.API_KEY}`,
      'HTTP-Referer': this.REFERER,
      'X-Title': this.TITLE,
      'Content-Type': 'application/json',
    };

    // Build messages array
    const messages: any[] = [];
    
    // Add system message if provided
    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage });
    }
    
    // Add user greeting if userName is provided
    if (userName && !messages.some(msg => msg.content.includes(`Hello ${userName}`))) {
      messages.push({ 
        role: 'assistant', 
        content: `Hello ${userName}! I'm your Harare City AI Assistant. How can I help you today?` 
      });
    }
    
    // Add the current user message
    messages.push({ role: 'user', content: prompt });

    const body = JSON.stringify({
      model: this.MODEL,
      messages: messages
    });

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API Error:', response.status, errorText);
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      // The response format is: { choices: [{ message: { content: ... } }] }
      if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error('No response generated from OpenRouter API');
      }
    } catch (error) {
      console.error('Error in generateResponse:', error);
      throw error;
    }
  }
} 