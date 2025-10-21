export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#f3e6cf", padding: "40px 0" }}>
      <div className="container d-flex justify-content-between flex-wrap">
        <div>
          <h5 className="fw-bold">
            <span style={{ color: "#000" }}>All</span>
            <span style={{ color: "#c7a44a" }}>Serve</span>
          </h5>
          <p>2025 AllServe. Todos os direitos reservados.</p>
        </div>
        <div>
          <h6>Links</h6>
          <ul className="list-unstyled">
            <li>Home</li>
            <li>Sobre</li>
            <li>Profissionais</li>
          </ul>
        </div>
        <div>
          <h6>Help</h6>
          <ul className="list-unstyled">
            <li>Payment Options</li>
            <li>Returns</li>
            <li>Privacy Policies</li>
          </ul>
        </div>
        <div>
          <h6>Newsletter</h6>
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              border: "none",
              borderBottom: "1px solid #000",
              background: "transparent",
              padding: "5px 0",
              marginRight: "10px",
            }}
          />
          <button className="btn btn-link text-dark fw-bold">SUBSCRIBE</button>
        </div>
      </div>
    </footer>
  );
}
