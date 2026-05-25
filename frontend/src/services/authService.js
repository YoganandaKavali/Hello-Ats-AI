import { STORAGE_KEYS } from "../utils/storageKeys";

function readUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/**
 * Register a new user. Does not sign them in — login is required separately.
 */
export function signup({ name, email, password }) {
  const trimmedEmail = email.trim().toLowerCase();
  const users = readUsers();

  if (users.some((u) => u.email === trimmedEmail)) {
    throw new Error("An account with this email already exists. Please log in.");
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: trimmedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);
}

/**
 * Verify credentials against saved users. Session is kept in React state only.
 */
export function login({ email, password }) {
  const trimmedEmail = email.trim().toLowerCase();
  const user = readUsers().find(
    (u) => u.email === trimmedEmail && u.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Clear any legacy session key (does not remove users or analyses).
 */
export function clearPersistedSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function logout() {
  clearPersistedSession();
}
