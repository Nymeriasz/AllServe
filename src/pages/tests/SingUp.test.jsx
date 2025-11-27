import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";
import SignUp from "../SignUp";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc } from "firebase/firestore";

// --- MOCKS ---
vi.mock("../../firebase/config", () => ({
  db: {},
  auth: {},
  storage: {}
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn()
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn()
}));

vi.mock("@chakra-ui/react", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useToast: () => vi.fn() };
});

describe("SignUp Page", () => {
  beforeEach(() => vi.clearAllMocks());

  test("renderiza campos", () => {
    render(<BrowserRouter><SignUp /></BrowserRouter>);
    
    // Verificações mais flexíveis
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    
    // Procura todos os campos que contêm "Senha"
    const passwordInputs = screen.getAllByLabelText(/senha/i);
    // Deve haver pelo menos 2 (Senha e Confirmar Senha)
    expect(passwordInputs.length).toBeGreaterThanOrEqual(2);
  });

  test("cria conta com sucesso", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: "123" } });
    setDoc.mockResolvedValue();

    render(<BrowserRouter><SignUp /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Nome Teste" } });
    
    // Pega o primeiro campo de email (caso haja mais de um label parecido)
    const emailInput = screen.getAllByLabelText(/email/i)[0];
    fireEvent.change(emailInput, { target: { value: "teste@email.com" } });
    
    // Pega os campos de senha usando getAll para evitar ambiguidade
    const passwordInputs = screen.getAllByLabelText(/senha/i);
    // Assumimos que a ordem é: Senha -> Confirmar Senha
    fireEvent.change(passwordInputs[0], { target: { value: "123456" } }); 
    fireEvent.change(passwordInputs[1], { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalled();
      expect(setDoc).toHaveBeenCalled();
    });
  });
});