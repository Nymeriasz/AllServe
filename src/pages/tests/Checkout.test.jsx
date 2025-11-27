import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, beforeEach, test, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Checkout from "../Checkout";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { addDoc } from "firebase/firestore";

// --- MOCKS ---
vi.mock("../../firebase/config", () => ({
  db: {},
  auth: {},
  storage: {}
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn()
}));
vi.mock("firebase/auth", () => ({}));

vi.mock("../../context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("../../context/CartContext", () => ({ useCart: vi.fn() }));

vi.mock("@chakra-ui/react", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useToast: () => vi.fn() };
});

describe("Checkout Page", () => {
  beforeEach(() => vi.clearAllMocks());

  test("exibe carrinho vazio", () => {
    useAuth.mockReturnValue({ currentUser: { uid: "123" } });
    useCart.mockReturnValue({ cart: [], removeFromCart: vi.fn(), clearCart: vi.fn(), getTotalPrice: () => 0 });

    render(<BrowserRouter><Checkout /></BrowserRouter>);
    expect(screen.getByText(/carrinho está vazio/i)).toBeInTheDocument();
  });

  test("renderiza itens", () => {
    useAuth.mockReturnValue({ currentUser: { uid: "123" } });
    useCart.mockReturnValue({
      cart: [{ id: "1", nome: "Bartender X", precoPorHora: 100, quantity: 2 }],
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
      getTotalPrice: () => 200
    });

    render(<BrowserRouter><Checkout /></BrowserRouter>);
    expect(screen.getByText("Bartender X")).toBeInTheDocument();
  });

  test("realiza pagamento", async () => {
    const clearCartMock = vi.fn();
    useAuth.mockReturnValue({ currentUser: { uid: "123", email: "teste@test.com" } });
    useCart.mockReturnValue({
      cart: [{ id: "1", nome: "B", precoPorHora: 50, quantity: 1 }],
      getTotalPrice: () => 50,
      clearCart: clearCartMock,
      removeFromCart: vi.fn()
    });
    addDoc.mockResolvedValue({ id: "pag1" });

    render(<BrowserRouter><Checkout /></BrowserRouter>);

    const btn = screen.getByRole("button", { name: /pagar/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled();
      expect(clearCartMock).toHaveBeenCalled();
    });
  });
});