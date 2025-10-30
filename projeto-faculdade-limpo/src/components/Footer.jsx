import { Link } from 'react-router-dom';

export default function Footer() {

  // Estilo do container principal do footer
  const footerStyle = {
    backgroundColor: "#f3e6cf", // Fundo bege claro
    padding: "60px 0"
  };

  // Estilo do container interno (imita o .container do Bootstrap)
  const containerStyle = {
    maxWidth: '1140px', // Largura máxima
    margin: '0 auto',
    padding: '0 15px',
    display: 'flex', // USA FLEXBOX
    flexWrap: 'wrap', // Permite quebrar linha em telas menores
    justifyContent: 'space-between' // Espaço entre colunas
  };

  // Estilo para os títulos ("Links", "Help", "Newsletter")
  const titleStyle = {
    color: "#6c757d", // Cinza suave
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '20px' // Espaço abaixo do título
  };

  // Estilo para os links ("Home", "Sobre", etc.)
  const linkStyle = {
    color: "#212529", // Preto suave
    textDecoration: "none",
    fontSize: '1rem',
    display: 'block', // Para que fiquem um abaixo do outro
    marginBottom: '10px' // Espaçamento entre os links
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>

        {/* Coluna 1: Logo e Copyright */}
        <div style={{ flexBasis: '30%', minWidth: '250px', marginBottom: '30px' }}>
          <h5 style={{ fontWeight: 'bold', marginBottom: '20px' }}>
            <span style={{ color: "#000" }}>All</span>
            <span style={{ color: "#c7a44a" }}>Serve</span>
          </h5>
          <p style={{ color: "#5a5a5a", fontSize: '0.9rem' }}>
            2025 AllServe.
            <br />
            Todos os direitos reservados.
          </p>
        </div>

        {/* Coluna 2: Links */}
        <div style={{ flexBasis: '15%', minWidth: '150px', marginBottom: '30px' }}>
          <h6 style={titleStyle}>Links</h6>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <Link to="/" style={linkStyle}>Home</Link>
            </li>
            <li>
              <Link to="/sobre" style={linkStyle}>Sobre</Link>
            </li>
            <li>
              <Link to="/profissionais" style={linkStyle}>Profissionais</Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Help */}
        <div style={{ flexBasis: '20%', minWidth: '170px', marginBottom: '30px' }}>
          <h6 style={titleStyle}>Help</h6>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <a href="#" style={linkStyle}>Payment Options</a>
            </li>
            <li>
              <a href="#" style={linkStyle}>Returns</a>
            </li>
            <li>
              <a href="#" style={linkStyle}>Privacy Policies</a>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Newsletter */}
        <div style={{ flexBasis: '30%', minWidth: '250px', marginBottom: '30px' }}>
          <h6 style={titleStyle}>Newsletter</h6>
          <form style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              aria-label="Enter Your Email Address"
              style={{
                border: "none",
                borderBottom: "1px solid #000",
                background: "transparent",
                padding: "5px 0",
                marginRight: "15px",
                outline: "none",
                color: "#000",
                flex: 1 // Faz o input crescer
              }}
            />
            <button
              type="submit"
              style={{
                background: "none",
                border: "none",
                color: "#000",
                padding: "0",
                cursor: "pointer",
                textDecoration: "underline",
                letterSpacing: "1px",
                fontSize: "0.9rem",
                fontWeight: "bold"
              }}
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

      </div>
    </footer>
  );
}