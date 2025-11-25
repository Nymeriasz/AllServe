import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Checkout from "../Checkout";
import { vi, describe, beforeEach, test, expect } from "vitest";

// ---------------------------MOCKS SIMPLES----------------------------------
vi.mock("../../context/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Firebase mocks
import * as firebaseMock from "../../mocks/firebase";

vi.mock("firebase/auth", () => firebaseMock);
vi.mock("firebase/firestore", () => firebaseMock);
vi.mock("firebase/storage", () => firebaseMock);

// Chakra UI
const mockToast = vi.fn();
vi.mock("@chakra-ui/react", () => ({
  useToast: () => mockToast,
}));

// React Router
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Hooks importados depois dos mocks
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
const { addDoc } = firebaseMock;

// ---------------------------TESTES----------------------------------
describe("Checkout Page — Testes Simples", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --------------1. Carrinho vazio--------------
  test("exibe mensagem de carrinho vazio", () => {
    useCart.mockReturnValue({
      cart: [],
      getTotalPrice: () => 0,
    });

    useAuth.mockReturnValue({ currentUser: null });

    render(<Checkout />);

    expect(screen.getByText("O seu carrinho está vazio.")).toBeInTheDocument();
  });

  // -------------2. Renderiza itens---------------
  test("renderiza itens do carrinho corretamente", () => {
    useCart.mockReturnValue({
      cart: [
        { id: 1, nome: "Bartender Teste", precoPorHora: "50", quantity: 1 },
      ],
      getTotalPrice: () => 50,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
    });

    useAuth.mockReturnValue({ currentUser: { uid: "123" } });

    render(<Checkout />);

    expect(screen.getByText("Bartender Teste")).toBeInTheDocument();
    expect(screen.getByText("R$ 50.00/hora")).toBeInTheDocument();
  });

  // ------------3. Impedir pagamento sem login----------------
  test("impede pagamento se usuário não estiver logado", () => {
    useCart.mockReturnValue({
      cart: [{ id: 1, nome: "Bartender", precoPorHora: "50", quantity: 1 }],
      getTotalPrice: () => 50,
    });

    useAuth.mockReturnValue({ currentUser: null });

    render(<Checkout />);

    fireEvent.click(screen.getByRole("button", { name: /pagar/i }));

    expect(mockToast).toHaveBeenCalled();
  });

  // -------------4. Pagamento bem-sucedido---------------
  test("realiza pagamento corretamente", async () => {
    const mockClearCart = vi.fn();

    useCart.mockReturnValue({
      cart: [
        { id: 1, nome: "Bartender A", precoPorHora: "100", quantity: 2 },
      ],
      getTotalPrice: () => 200,
      clearCart: mockClearCart,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
    });

    useAuth.mockReturnValue({
      currentUser: { uid: "abc", displayName: "Cliente Teste" },
    });

    addDoc.mockResolvedValue({ id: "123" });

    render(<Checkout />);

    fireEvent.click(screen.getByRole("button", { name: /pagar/i }));

    await waitFor(() => expect(addDoc).toHaveBeenCalled());

    expect(mockClearCart).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/historico-pagamentos");
  });
});