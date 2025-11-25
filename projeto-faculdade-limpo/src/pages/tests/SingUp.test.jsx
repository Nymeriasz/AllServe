import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUp from "../SignUp";
import { describe, test, expect, beforeEach, vi } from "vitest";

// Firebase (mock único)
vi.mock("firebase/auth", () => import("../../mocks/firebase.js"));
vi.mock("firebase/firestore", () => import("../../mocks/firebase.js"));
vi.mock("firebase/storage", () => import("../../mocks/firebase.js"));

// ------------------ Mock useNavigate ------------------
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ------------------ Mock useToast ---------------------
const mockToast = vi.fn();

vi.mock("@chakra-ui/react", async () => {
  const original = await vi.importActual("@chakra-ui/react");
  return {
    ...original,
    useToast: () => mockToast,
  };
});

// ------------------ Render Helper ---------------------
const renderSignUp = () =>
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );

describe("SignUp Page — Revisado", () => {
  beforeEach(() => vi.clearAllMocks());

  // -----------------------------------------------------
  test("renderiza campos essenciais", () => {
    renderSignUp();

    expect(screen.getByRole("heading", { name: /crie sua conta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/eu sou/i)).toBeInTheDocument();
  });

  // -----------------------------------------------------
  test("mostra toast quando senhas não coincidem", async () => {
    renderSignUp();

    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: "abcdef" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Senhas não conferem",
          status: "error",
        })
      )
    );
  });

  // -----------------------------------------------------
  test("cadastra cliente e vai para /home", async () => {
    const { createUserWithEmailAndPassword } = require("firebase/auth");
    const { setDoc } = require("firebase/firestore");

    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "user123" },
    });

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Maria" } });
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "cliente@test.com" } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/eu sou/i), { target: { value: "cliente" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  // -----------------------------------------------------
  test("cadastra bartender e vai para /dashboard", async () => {
    const { createUserWithEmailAndPassword } = require("firebase/auth");

    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "bart123" },
    });

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/nome completo/i), { value: "João" });
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "bart@test.com" } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/eu sou/i), { target: { value: "bartender" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  // -----------------------------------------------------
  test("exibe toast de erro quando Firebase falha", async () => {
    const { createUserWithEmailAndPassword } = require("firebase/auth");

    createUserWithEmailAndPassword.mockRejectedValue(new Error("Email já usado"));

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Erro ao criar conta",
          status: "error",
        })
      )
    );
  });
});