import { createMuiTheme } from '@material-ui/core/styles';

// Required to use type import, as a plain side-effect import will be emitted to runtime.
import type {} from '@material-ui/lab/themeAugmentation';

export const theme = createMuiTheme({
    header: {
        height: '55px'
    },
    drawer: {
        width: '72px'
    },
    palette: {
        background: {
            default: 'rgb(244, 245, 247)'
        },
        text: {
            primary: 'rgb(23, 43, 77)'
        },
        primary: {
            light: '#93F6A7',
            main: '#00AB55',
            dark: '#00634F'
        },
        error: {
            light: '#FFC9B3',
            main: '#ff4842',
            dark: '#931531'
        }
    },
    overrides: {
        MuiFormControlLabel: {
            label: {
                color: 'rgb(107, 119, 140)'
            }
        },
        MuiCheckbox: {
            root: {
                color: 'rgb(107, 119, 140)'
            }
        },
        MuiButton: {
            root: {
                borderRadius: '16px'
            }
        },
        MuiAlert: {
            root: {
                borderRadius: '16px'
            }
        },
        MuiCard: {
            root: {
                borderRadius: '16px',
                backgroundColor: 'rgb(255,255,255)'
            }
        },
        MuiLink: {
            root: {
                color: 'rgb(107, 119, 140)'
            }
        }
        // MuiInputLabel: {
        //     root: {
        //         color: 'rgb(23, 43, 77)'
        //     }
        // }
    }
});
