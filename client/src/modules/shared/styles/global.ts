import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
#root {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    'header'
    'main'
    'footer';
}

html, body, #root {
  height: 100%;
  width: 100%;
}
`;

export default GlobalStyle;
