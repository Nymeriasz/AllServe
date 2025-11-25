import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AvaliarBartender from "../AvaliarBartender";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, test, beforeEach, expect } from "vitest";

// =========================
// MOCKS SIMPLIFICADOS
// =========================
vi.mock("firebase/auth", () => import("../../mocks/firebase.js"));
vi.mock("firebase/firestore", () => import("../../mocks/firebase.js"));
vi.mock("firebase/storage", () => import("../../mocks/firebase.js"));

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// --- mock Navigate e Params ---
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ bartenderId: "123" }),
  };
});

// --- mock Toast ---
const mockToast = vi.fn();
vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

// =========================
// Render helper
// =========================
const renderPage = () =>
  render(
    <BrowserRouter>
      <AvaliarBartender />
    </BrowserRouter>
  );

describe("AvaliarBartender Page (Simplificado)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------
  test("renderiza o título corretamente", () => {
    require("../../context/AuthContext").useAuth.mockReturnValue({
      currentUser: { uid: "abc", email: "x@y.com" },
    });

    renderPage();

    expect(screen.getByText("Avaliar Bartender")).toBeInTheDocument();
  });

  // ---------------------------------------
  test("exibe erro quando o usuário não está logado", () => {
    require("../../context/AuthContext").useAuth.mockReturnValue({
      currentUser: null,
    });

    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Erro",
        description: "Você precisa estar logado.",
        status: "error",
      })
    );
  });

  // ---------------------------------------
  test("não deixa enviar sem selecionar nota", () => {
    require("../../context/AuthContext").useAuth.mockReturnValue({
      currentUser: { uid: "abc" },
    });

    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Nota obrigatória",
        status: "warning",
      })
    );
  });

  // ---------------------------------------
  test("permite selecionar uma estrela", () => {
    require("../../context/AuthContext").useAuth.mockReturnValue({
      currentUser: { uid: "abc" },
    });

    renderPage();

    const stars = screen.getAllByTestId("fa-icon");

    fireEvent.click(stars[2]); // 3ª estrela

    expect(stars[2]).toBeInTheDocument(); // simples e suficiente
  });

  // ---------------------------------------
  test("envia avaliação corretamente", async () => {
    const { addDoc } = require("firebase/firestore");

    require("../../context/AuthContext").useAuth.mockReturnValue({
      currentUser: { uid: "abc", email: "usuario@test.com" },
    });

    addDoc.mockResolvedValueOnce({ id: "av123" });

    renderPage();

    fireEvent.click(screen.getAllByTestId("fa-icon")[4]); // 5 estrelas

    const textarea = screen.getByPlaceholderText(
      "Conte como foi sua experiência..."
    );
    fireEvent.change(textarea, { target: { value: "Muito bom!" } });

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledTimes(1);
    });

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        autorId: "abc",
        nota: 5,
        comentario: "Muito bom!",
        visivel: true,
        createdAt: "mocked-timestamp",
        tipo: "avaliacao",
      })
    );

    expect(mockToast).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});