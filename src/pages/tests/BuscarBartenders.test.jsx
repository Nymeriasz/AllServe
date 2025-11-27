import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, beforeEach, test, expect } from "vitest";
import BuscarBartenders from "../BuscarBartenders";
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
  getDocs: vi.fn(),
}));

vi.mock("firebase/auth", () => ({}));
vi.mock("firebase/storage", () => ({}));

vi.mock("../../components/BartenderCard", () => ({
  default: ({ bartender }) => <div data-testid="card">{bartender.nome}</div>
}));

describe("BuscarBartenders Page", () => {
  beforeEach(() => vi.clearAllMocks());

  test("renderiza lista de bartenders", async () => {
    const mockData = [
      { id: "1", nome: "João Bartender", especialidade: "Mixologista" },
      { id: "2", nome: "Maria Barista", especialidade: "Barista" }
    ];

    getDocs.mockResolvedValue({
      docs: mockData.map(d => ({ id: d.id, data: () => d }))
    });

    render(<BrowserRouter><BuscarBartenders /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText("João Bartender")).toBeInTheDocument();
    });
  });

  test("filtra por nome", async () => {
    const mockData = [
      { id: "1", nome: "João Bartender", especialidade: "Mixologista" },
      { id: "2", nome: "Maria Barista", especialidade: "Barista" }
    ];
    getDocs.mockResolvedValue({
      docs: mockData.map(d => ({ id: d.id, data: () => d }))
    });

    render(<BrowserRouter><BuscarBartenders /></BrowserRouter>);
    await waitFor(() => screen.getByText("João Bartender"));

    const input = screen.getByPlaceholderText(/digite o nome/i);
    fireEvent.change(input, { target: { value: "Maria" } });

    expect(screen.getByText("Maria Barista")).toBeInTheDocument();
    expect(screen.queryByText("João Bartender")).not.toBeInTheDocument();
  });
});