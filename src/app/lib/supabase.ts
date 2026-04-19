import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// API base URL
export const API_BASE = `${supabaseUrl}/functions/v1/make-server-f5317610`;

// Helper function for API calls with retry
export async function apiCall(endpoint: string, options?: RequestInit, retries = 2) {
  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'API request failed' }));
        console.error(`API Error [${endpoint}]:`, error);
        throw new Error(error.error || error.message || 'API request failed');
      }

      return response.json();
    } catch (error) {
      lastError = error;
      console.error(`Fetch Error [${endpoint}] (attempt ${i + 1}/${retries + 1}):`, error);

      // Wait before retry (exponential backoff)
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 500));
      }
    }
  }

  throw lastError;
}
