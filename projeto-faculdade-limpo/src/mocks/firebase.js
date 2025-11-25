import { vi } from "vitest";

/* ========================
   AUTH
======================== */
export const getAuth = vi.fn(() => ({
  currentUser: { uid: "mockUid", email: "mock@mail.com" },
}));

export const createUserWithEmailAndPassword = vi.fn(async () => ({
  user: { uid: "mockUid", email: "mock@mail.com" },
}));

export const signInWithEmailAndPassword = vi.fn(async () => ({
  user: { uid: "mockUid", email: "mock@mail.com" },
}));

// corrigido: firebase exige { displayName }
export const updateProfile = vi.fn(async (user, data) => {
  return true;
});

/* ========================
   FIRESTORE
======================== */
export const getFirestore = vi.fn(() => ({}));

export const collection = vi.fn(() => ({}));
export const doc = vi.fn(() => ({}));

export const setDoc = vi.fn(async () => true);
export const updateDoc = vi.fn(async () => true);
export const deleteDoc = vi.fn(async () => true);

export const addDoc = vi.fn(async () => ({ id: "mock-id" }));

export const getDocs = vi.fn(async () => ({
  docs: [],
}));

/* ========================
   STORAGE
======================== */
export const getStorage = vi.fn(() => ({}));
export const ref = vi.fn(() => ({}));
export const uploadBytes = vi.fn(async () => true);
export const getDownloadURL = vi.fn(async () => "https://mock.url");
