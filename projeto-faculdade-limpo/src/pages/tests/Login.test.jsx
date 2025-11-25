import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import { vi, describe, test, expect, beforeEach } from "vitest";

// ----------------------- MOCKS FIREBASE -----------------------
import * as firebaseMock from "../../mocks/firebase.js";

vi.mock("firebase/auth", () => firebaseMock);
vi.mock("firebase/firestore", () => firebaseMock);
vi.mock("firebase/storage", () => firebaseMock);

const { signInWithEmailAndPassword } = firebaseMock;

// ----------------------- MOCK useNavigate ---------------------
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ----------------------- MOCK TOAST ---------------------------
const mockToast = vi.fn();

vi.mock("@chakra-ui/react", async () => {
  const original = await vi.importActual("@chakra-ui/react");
  return {
    ...original,
    useToast: () => mockToast,
  };
});

// ----------------------- MOCK AUTH CONTEXT --------------------
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
  }),
}));

// ----------------------- RENDER HELPER ------------------------
const renderLogin = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

// ---------------------------- TESTES --------------------------
describe("Login Page — revisado", () => {
  beforeEach(() => vi.clearAllMocks());

  test("renderiza o título", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: /entrar/i })).toBeInTheDocument();
  });

  test("renderiza inputs de email e senha", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  test("envia formulário com email e senha", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: {} });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "teste@exemplo.com" },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() =>
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        "teste@exemplo.com",
        "123456"
      )
    );
  });

  test("mostra toast de sucesso ao logar", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: {} });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "teste@exemplo.com" },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Login bem-sucedido.",
          status: "success",
        })
      )
    );
  });

  test("mostra toast de erro ao falhar login", async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error("Auth error"));

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "erro@teste.com" },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Erro no login.",
          status: "error",
        })
      )
    );
  });

  test("redireciona para /dashboard após login", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: {} });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "teste@teste.com" },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
    );
  });
});