import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../Home";

// Mock do react-router-dom caso o Home use <Link>, <NavLink> ou navegação
vi.mock("react-router-dom", () => ({
  Link: ({ children }) => <a>{children}</a>,
}));

describe("Home Component", () => {
  it("deve renderizar o título principal corretamente", () => {
    render(<Home />);

    const headingElement = screen.getByRole("heading", {
      name: /Ache o bartender ideal para o seu evento/i,
    });

    expect(headingElement).toBeInTheDocument();
  });

  it('deve renderizar a seção "Nossos serviços"', () => {
    render(<Home />);

    const servicesHeading = screen.getByRole("heading", {
      name: /Nossos serviços/i,
    });

    expect(servicesHeading).toBeInTheDocument();
  });

  it('deve renderizar a seção "Profissionais"', () => {
    render(<Home />);

    const professionalsHeading = screen.getByRole("heading", {
      name: /Profissionais/i,
    });

    expect(professionalsHeading).toBeInTheDocument();
  });
});