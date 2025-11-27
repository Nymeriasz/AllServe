import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, test, beforeEach, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AvaliarBartender from "../AvaliarBartender";
import { useAuth } from "../../context/AuthContext";
import { addDoc } from "firebase/firestore";

// --- MOCKS ---
// 1. Mock do config para evitar inicialização real
vi.mock("../../firebase/config", () => ({
  db: {},
  auth: {},
  storage: {}
}));

// 2. Mock das bibliotecas do Firebase
vi.mock("firebase/auth", () => ({ getAuth: vi.fn() }));
vi.mock("firebase/storage", () => ({}));
vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn()
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@chakra-ui/react", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useToast: () => vi.fn() };
});

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ bartenderId: "123" }),
  };
});

describe("AvaliarBartender Page", () => {
  beforeEach(() => vi.clearAllMocks());

  test("renderiza o título corretamente", () => {
    useAuth.mockReturnValue({ currentUser: { uid: "abc" } });
    render(<BrowserRouter><AvaliarBartender /></BrowserRouter>);
    expect(screen.getByText("Avaliar Bartender")).toBeInTheDocument();
  });

  test("exibe erro se usuário não logado", () => {
    useAuth.mockReturnValue({ currentUser: null });
    render(<BrowserRouter><AvaliarBartender /></BrowserRouter>);
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
    expect(addDoc).not.toHaveBeenCalled();
  });
});