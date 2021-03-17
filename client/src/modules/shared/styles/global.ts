import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
${normalize}

* {
    box-sizing: border-box;
}

#root {
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    'header'
    'main'
    'footer';
}

body {
    background: linear-gradient( 135deg, rgba(93,140,100,0.7) 0%, rgba(29,185,84,1) 100% );
    background-repeat: no-repeat;
    background-attachment: fixed;
    margin: 0;
}

a {
    text-decoration: none;
    color: inherit;
}
`;

export default GlobalStyle;
