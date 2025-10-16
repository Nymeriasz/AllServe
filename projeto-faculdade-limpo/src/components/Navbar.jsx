import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config.js';
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap"; 
import { ShoppingCart, User, Search, LayoutDashboard, LogOut } from "lucide-react"; 
import { useLocation } from 'react-router-dom';
import '../pages/Home.css'

// Cores usadas com frequencia
const CustomGold = "#A5874D"; 
const DarkText = "#292728"; 

const NavLinkWithActive = ({ children, to }) => {
    const location = useLocation();
    const isActive = location.hash === to; 
    const style = {
        color: isActive ? CustomGold : DarkText, 
        fontWeight: isActive ? '600' : '400', 
        fontSize: '0.95rem',
        transition: 'color 0.15s ease-in-out',
        '--bs-nav-link-hover-color': CustomGold, 
    };
    return (
        <Nav.Link 
            href={to} 
            style={style}
            className="mx-3"
            active={isActive} 
        >
            {children}
        </Nav.Link>
    );
};

export default function NavBar() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };
    
    const iconStyle = { color: DarkText };

    const handleSearchClick = () => {
        navigate('/BuscarBartender'); 
    };

    return (
        <Navbar 
            bg="white" 
            expand="lg"
            className="py-3 border-bottom"
            sticky="top"
        >
            <Container>
                {/* Logo */}
                <Navbar.Brand 
                  href="#inicio" 
                  className="fw-bold"
                >
                    <span style={{ color: DarkText, fontSize: '1.25rem' }}>All</span>
                    <span style={{ color: CustomGold, fontSize: '1.25rem' }}>Serve</span>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    
                    {/* Redirecionamento principal */}
                    <Nav className="mx-auto">
                        <NavLinkWithActive to="#inicio">Início</NavLinkWithActive>
                        <NavLinkWithActive to="#sobre">Sobre</NavLinkWithActive>
                        <NavLinkWithActive to="#profissionais">Profissionais</NavLinkWithActive>
                    </Nav>
                    
                    {/* Ícones */}
                    <Nav className="align-items-center">
                        
                        {/* 1. Ícone de Pesquisa */}
                        <Nav.Link 
                            style={iconStyle} 
                            className="me-2"
                            onClick={handleSearchClick}
                            role="button"
                        >
                            <Search size={20} />
                        </Nav.Link>
                        
                        {/* 2. Ícone de Carrinho */}
                        <Nav.Link style={iconStyle} className="me-2">
                            <ShoppingCart size={20} />
                        </Nav.Link>
                        
                        {/* 3. Ícone de Usuário  */}
                        <Dropdown as={Nav.Item} align="end">
                            
                            <Dropdown.Toggle 
                                as={Nav.Link} 
                                style={iconStyle} 
                                id="user-dropdown-toggle"
                                className="me-2 user-dropdown-toggle-no-caret"
                            >
                                <User size={20} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {currentUser ? (
                                    // Conteúdo para Usuário Logado
                                    <>
                                        <Dropdown.Header>
                                            Olá, {currentUser.email.split('@')[0]}
                                        </Dropdown.Header>
                                        <Dropdown.Divider />
                                        <Dropdown.Item 
                                            as={RouterLink} 
                                            to="/dashboard" 
                                            className="d-flex align-items-center"
                                        >
                                            <LayoutDashboard size={18} className="me-2" />
                                            Dashboard
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center text-danger">
                                            <LogOut size={18} className="me-2" />
                                            Sair
                                        </Dropdown.Item>
                                    </>
                                ) : (
                                    // Conteúdo para Usuário Deslogado
                                    <>
                                        <Dropdown.Item 
                                            as={RouterLink} 
                                            to="/login" 
                                        >
                                            Entrar
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item 
                                            as={RouterLink} 
                                            to="/signup" 
                                            style={{ color: CustomGold, fontWeight: '600' }}
                                        >
                                            Criar Conta
                                        </Dropdown.Item>
                                    </>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
