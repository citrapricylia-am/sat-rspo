// api.ts (frontend)
export interface ApiUser {
	id: number;
	fullName: string;
	email: string;
	phone?: string;
	address?: string;
	role: 'petani' | 'manajer';
  }
  
  // Panggil proxy Vercel (origin yang sama), jadi TIDAK ada CORS
  const base = '/api';
  
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${base}${path}`, {
	  headers: { 'Content-Type': 'application/json' },
	  ...options,
	});
	const text = await res.text();
	let data: any;
	try {
	  data = JSON.parse(text);
	} catch {
	  throw new Error(`Invalid JSON response: ${text.slice(0, 120)}...`);
	}
	if (!res.ok) throw new Error(data?.error || 'Request failed');
	return data as T;
  }
  
  export const api = {
	register: (payload: {
	  fullName: string;
	  email: string;
	  phone?: string;
	  address?: string;
	  role: 'petani' | 'manajer';
	  password: string;
	}): Promise<ApiUser> =>
	  request<ApiUser>(`/register`, {
		method: 'POST',
		body: JSON.stringify(payload),
	  }),
  
	login: (payload: { email: string; password: string }): Promise<ApiUser> =>
	  request<ApiUser>(`/login`, {
		method: 'POST',
		body: JSON.stringify(payload),
	  }),
  
	saveAssessment: (payload: {
	  userId: number;
	  stage: 1 | 2 | 3;
	  answers: unknown;
	  totalScore: number;
	  maxScore: number;
	  percentage: number;
	}): Promise<{ ok: true; id: number }> =>
	  request(`/save-assessment`, {
		method: 'POST',
		body: JSON.stringify(payload),
	  }),
  };
  