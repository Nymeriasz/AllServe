import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, beforeEach, test, expect } from "vitest";
import ListaBartenders from "../ListaBartenders";
import { getDocs } from "firebase/firestore";

// --- MOCKS ---
vi.mock("../../firebase/config", () => ({
  db: {},
  auth: {},
  storage: {}
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn()
}));
vi.mock("firebase/auth", () => ({}));

describe("ListaBartenders Page", () => {
  beforeEach(() => vi.clearAllMocks());

  test("exibe bartenders", async () => {
    const mockData = [{ id: "1", email: "a@a.com", nome: "Bartender A" }];
    getDocs.mockResolvedValue({
      docs: mockData.map(d => ({ id: d.id, data: () => d }))
    });

    render(<BrowserRouter><ListaBartenders /></BrowserRouter>);

    await waitFor(() => {
      // Verifica se o email aparece no card (conforme seu componente)
      expect(screen.getByText("a@a.com")).toBeInTheDocument(); 
    });
  });

  test("exibe mensagem vazia", async () => {
    getDocs.mockResolvedValue({ docs: [] });
    render(<BrowserRouter><ListaBartenders /></BrowserRouter>);
    await waitFor(() => {
      expect(screen.getByText(/Nenhum bartender encontrado/i)).toBeInTheDocument();
    });
  });
});