import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
${normalize}

* {
    box-sizing: border-box;
}

a {
    text-decoration: none;
    color: inherit;
}
`;

export default GlobalStyle;
