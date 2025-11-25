import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ListaBartenders from "../ListaBartenders";
import { vi } from "vitest";

// ----------------------- MOCKS FIREBASE -----------------------
import * as firebaseMock from "../../mocks/firebase.js";

vi.mock("firebase/auth", () => firebaseMock);
vi.mock("firebase/firestore", () => firebaseMock);
vi.mock("firebase/storage", () => firebaseMock);

const { getDocs } = firebaseMock;

// ----------------------- MOCK useNavigate ---------------------
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ---------------------- DADOS MOCK -----------------------------
const mockBartenders = [
  { id: "1", email: "bart1@email.com", nome: "Bartender 1" },
  { id: "2", email: "bart2@email.com", nome: "Bartender 2" },
];

// ----------------------- FUNÇÃO DE RENDER ----------------------
const renderPage = () =>
  render(
    <BrowserRouter>
      <ListaBartenders />
    </BrowserRouter>
  );

// ---------------------------- TESTES ---------------------------
describe("ListaBartenders — Testes Simples", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ------------------------------------
  test("exibe spinner enquanto carrega", () => {
    getDocs.mockImplementation(() => new Promise(() => {})); // promessa nunca resolvida

    renderPage();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // ------------------------------------
  test("exibe lista de bartenders", async () => {
    getDocs.mockResolvedValue({
      docs: mockBartenders.map((b) => ({
        id: b.id,
        data: () => b,
      })),
    });

    renderPage();

    await waitFor(() =>
      expect(
        screen.getByText(mockBartenders[0].email)
      ).toBeInTheDocument()
    );

    expect(
      screen.getByText(mockBartenders[1].email)
    ).toBeInTheDocument();
  });

  // ------------------------------------
  test("exibe mensagem quando lista está vazia", async () => {
    getDocs.mockResolvedValue({ docs: [] });

    renderPage();

    await waitFor(() =>
      expect(
        screen.getByText("Nenhum bartender encontrado.")
      ).toBeInTheDocument()
    );
  });

  // ------------------------------------
  test("links de perfil e avaliação têm as rotas corretas", async () => {
    getDocs.mockResolvedValue({
      docs: mockBartenders.map((b) => ({
        id: b.id,
        data: () => b,
      })),
    });

    renderPage();

    await waitFor(() =>
      screen.getByText(mockBartenders[0].email)
    );

    const perfil = screen.getAllByRole("button", { name: /ver perfil/i })[0];
    const avaliar = screen.getAllByRole("button", { name: /avaliar/i })[0];

    expect(perfil.closest("a")).toHaveAttribute("href", "/bartender/1");
    expect(avaliar.closest("a")).toHaveAttribute("href", "/avaliar/1");
  });
});
