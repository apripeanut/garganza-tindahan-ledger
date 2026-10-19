import { supabase } from "@/lib/supabase";

export type Customer = {
  id: string;
  name: string;
  balance: number;
  lastPaid: string;
};

export type Profile = {
  id: string;
  email: string;
  role: "admin" | "client";
};

const BASE = process.env.EXPO_PUBLIC_API_URL;

if (!BASE) {
  throw new Error("Set EXPO_PUBLIC_API_URL in .env");
}

// Timeout helper
function timeout(ms: number): Promise<never> {
  return new Promise((_, fail) =>
    setTimeout(() => fail(new Error("timeout")), ms),
  );
}

// Get the current user's Supabase access token
async function authHeader(): Promise<Record<string, string>> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Not signed in");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// GET request with authentication
async function get(path: string) {
  const headers = await authHeader();

  const res = await Promise.race([
    fetch(BASE + path, {
      headers,
    }),
    timeout(8000),
  ]);

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return res.json();
}

// Add a customer with authentication
export async function addCustomer(
  name: string,
  balance: number,
): Promise<Customer> {
  const headers = await authHeader();

  const res = await Promise.race([
    fetch(BASE + "/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ name, balance }),
    }),
    timeout(8000),
  ]);

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return res.json();
}

// Fetch all customers
export const fetchCustomers = (): Promise<Customer[]> => get("/api/customers");

// Fetch one customer
export const fetchCustomer = (id: string): Promise<Customer> =>
  get(`/api/customers/${encodeURIComponent(id)}`);

// Fetch the signed-in user's profile
export const fetchProfile = (): Promise<Profile> => get("/api/me");
