import { extendTheme } from '@chakra-ui/react';


const colors = {
  primaria: "#A5874D",       // --cor-primaria
  primariaHover: "#8C713B",  // --cor-primaria-hover
  fundo: "#fff",             // --cor-fundo
  fundoCard: "#f8f5f0",      // .card bg
  corFooter: "#f3ebd7",      // --cor-footer
  textoEscuro: "#292728",       // --cor-texto-escuro
  textoPrincipal: "#333",    // --cor-texto-principal
  bannerBg: "#eaddc0",       // .barra-ferramentas
};


const fonts = {
  body: "'Inter', sans-serif",    //
  heading: "'Inter', sans-serif", //
};


const components = {
  Button: {
  
    variants: {
     
      principal: {
        bg: 'primaria',
        color: 'fundo',
        fontWeight: 'bold',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        _hover: {
          bg: 'primariaHover',
          transform: 'scale(1.05)',
        },
      },
    
      secundario: {
        border: '2px solid',
        borderColor: 'primaria',
        bg: 'transparent',
        color: 'primaria',
        fontWeight: 'bold',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        _hover: {
          bg: 'primaria',
          color: 'fundo',
          transform: 'scale(1.05)',
        },
      },
    },
  },
};


const theme = extendTheme({ colors, fonts, components });
export default theme;