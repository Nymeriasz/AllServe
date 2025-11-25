import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import BuscarBartenders from "../BuscarBartenders";
import { vi, describe, beforeEach, test, expect } from "vitest";

// ---------------------------Mock react-router-dom----------------------------------
const mockNavigate = vi.fn();
let mockLocationState = {};

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: mockLocationState }),
  };
});

// ----------------------------Mock Firebase---------------------------------
import * as firebaseMock from "../../mocks/firebase";

vi.mock("firebase/auth", () => firebaseMock);
vi.mock("firebase/firestore", () => firebaseMock);
vi.mock("firebase/storage", () => firebaseMock);

// -------------------------Mock BartenderCard------------------------------------
vi.mock("../../components/BartenderCard", () => ({
  __esModule: true,
  default: ({ bartender }) => (
    <div data-testid="bartender-card">{bartender.nome}</div>
  ),
}));

// ---------------------------Dados mock----------------------------------
const mockBartenders = [
  { id: "1", nome: "Carlos Silva", especialidade: "Mixologista" },
  { id: "2", nome: "Bruna Souza", especialidade: "Barista" },
];

const renderPage = () =>
  render(
    <BrowserRouter>
      <BuscarBartenders />
    </BrowserRouter>
  );


// ============================ TESTES ==================================
describe("BuscarBartenders - Testes Simples", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocationState = {}; // reseta o estado do useLocation
  });

  test("mostra spinner enquanto carrega", () => {
    firebaseMock.getDocs.mockReturnValue(new Promise(() => {})); // pendente

    renderPage();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("renderiza lista de bartenders", async () => {
    firebaseMock.getDocs.mockResolvedValue({
      docs: mockBartenders.map((b) => ({ id: b.id, data: () => b })),
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Carlos Silva")).toBeInTheDocument();
    });

    expect(screen.getByText("Bruna Souza")).toBeInTheDocument();
  });

  test("filtra por nome", async () => {
    firebaseMock.getDocs.mockResolvedValue({
      docs: mockBartenders.map((b) => ({ id: b.id, data: () => b })),
    });

    renderPage();

    await waitFor(() => screen.getByText("Carlos Silva"));

    fireEvent.change(
      screen.getByPlaceholderText("Digite o nome do bartender..."),
      { target: { value: "Bruna" } }
    );

    expect(screen.getByText("Bruna Souza")).toBeInTheDocument();
    expect(screen.queryByText("Carlos Silva")).not.toBeInTheDocument();
  });

  test("filtra por especialidade", async () => {
    firebaseMock.getDocs.mockResolvedValue({
      docs: mockBartenders.map((b) => ({ id: b.id, data: () => b })),
    });

    renderPage();

    await waitFor(() => screen.getByText("Carlos Silva"));

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Barista" },
    });

    expect(screen.getByText("Bruna Souza")).toBeInTheDocument();
    expect(screen.queryByText("Carlos Silva")).not.toBeInTheDocument();
  });

  test("exibe mensagem caso nenhum resultado", async () => {
    firebaseMock.getDocs.mockResolvedValue({
      docs: mockBartenders.map((b) => ({ id: b.id, data: () => b })),
    });

    renderPage();
    await waitFor(() => screen.getByText("Carlos Silva"));

    fireEvent.change(
      screen.getByPlaceholderText("Digite o nome do bartender..."),
      { target: { value: "xxxx" } }
    );

    expect(
      screen.getByText("Nenhum profissional encontrado com esses critérios.")
    ).toBeInTheDocument();
  });

  test("usa filtro inicial vindo do useLocation", async () => {
    mockLocationState = { search: "Bruna" };

    firebaseMock.getDocs.mockResolvedValue({
      docs: mockBartenders.map((b) => ({ id: b.id, data: () => b })),
    });

    renderPage();

    await waitFor(() => screen.getByText("Bruna Souza"));

    expect(screen.getByText("Bruna Souza")).toBeInTheDocument();
    expect(screen.queryByText("Carlos Silva")).not.toBeInTheDocument();
  });
});