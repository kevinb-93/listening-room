import { createMuiTheme } from '@material-ui/core/styles';

// Required to use type import, as a plain side-effect import will be emitted to runtime.
import type {} from '@material-ui/lab/themeAugmentation';

export const theme = createMuiTheme({
    header: {
        height: '55px'
    },
    drawer: {
        width: '72px'
    }
});
