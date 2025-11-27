import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";
import Login from "../Login";
import { signInWithEmailAndPassword } from "firebase/auth";

// --- MOCKS ---
vi.mock("../../firebase/config", () => ({
  db: {},
  auth: {},
  storage: {}
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn()
}));
vi.mock("firebase/firestore", () => ({}));

vi.mock("@chakra-ui/react", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useToast: () => vi.fn() };
});

describe("Login Page", () => {
  beforeEach(() => vi.clearAllMocks());

  test("renderiza inputs", () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  test("faz login com sucesso", async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "123" } });

    render(<BrowserRouter><Login /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@a.com" } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
    });
  });
});