import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
${normalize}

* {
    box-sizing: border-box;
}

html, body, #root {
    height: 100%;
    margin: 0;
}

body {
    background: linear-gradient( 135deg, rgba(93,140,100,0.7) 0%, rgba(29,185,84,1) 100% );
    background-repeat: no-repeat;
    background-attachment: fixed;
}

a {
    text-decoration: none;
    color: inherit;
}
`;

export default GlobalStyle;
