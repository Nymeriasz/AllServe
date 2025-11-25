// src/mocks/firebase.js
import { vi } from "vitest";

// ============================
// AUTH
// ============================
export const getAuth = vi.fn(() => ({
  currentUser: { uid: "123", email: "test@example.com" },
}));

export const signInWithEmailAndPassword = vi.fn(() =>
  Promise.resolve({
    user: { uid: "123", email: "test@example.com" },
  })
);

export const createUserWithEmailAndPassword = vi.fn(() =>
  Promise.resolve({
    user: { uid: "123", email: "new@example.com" },
  })
);

export const updateProfile = vi.fn(() => Promise.resolve());

// ============================
// FIRESTORE
// ============================
export const getFirestore = vi.fn(() => ({}));

export const collection = vi.fn(() => ({}));
export const addDoc = vi.fn(() => Promise.resolve({ id: "mock-id" }));
export const getDocs = vi.fn(() =>
  Promise.resolve({
    docs: [
      {
        id: "1",
        data: () => ({ name: "Bartender teste", avaliacao: 5 }),
      },
    ],
  })
);

export const doc = vi.fn(() => ({}));
export const setDoc = vi.fn(() => Promise.resolve());
export const updateDoc = vi.fn(() => Promise.resolve());
export const deleteDoc = vi.fn(() => Promise.resolve());
