export const DEMO_AUTH_KEY = "broadsec_demo_user";

export type DemoRole = "researcher" | "admin";

export interface DemoUser {
  name: string;
  email: string;
  role: DemoRole;
}

export const demoUsers: Record<DemoRole, DemoUser> = {
  researcher: {
    name: "A. Chaoui",
    email: "researcher@broadsec.demo",
    role: "researcher",
  },
  admin: {
    name: "BroadSec Admin",
    email: "admin@broadsec.demo",
    role: "admin",
  },
};

export function getDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(DEMO_AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoUser;

    if (parsed.role !== "researcher" && parsed.role !== "admin") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function setDemoUser(role: DemoRole) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoUsers[role]));
}

export function clearDemoUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DEMO_AUTH_KEY);
}
