import { createMuiTheme } from '@material-ui/core/styles';

// Required to use type import, as a plain side-effect import will be emitted to runtime.
import type {} from '@material-ui/lab/themeAugmentation';

const defaultTheme = createMuiTheme();

export const theme = createMuiTheme({
    header: {
        height: '55px'
    },
    drawer: {
        width: '72px'
    },
    typography: {
        h6: {
            fontWeight: 600
        },
        body2: {
            color: 'rgb(107, 119, 140)'
        }
    },
    palette: {
        background: {
            default: 'rgb(244, 245, 247)'
        },
        text: {
            primary: 'rgb(23, 43, 77)',
            secondary: 'rgb(107, 119, 140)'
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
                borderRadius: '16px',
                fontWeight: 600,
                textTransform: 'none'
            }
        },
        MuiAlert: {
            root: {
                borderRadius: '16px'
            }
        },
        MuiCardContent: {
            root: {
                padding: '8px 16px 16px'
            }
        },
        MuiCard: {
            root: {
                borderRadius: '16px',
                backgroundColor: 'rgb(255,255,255)'
            }
        },
        MuiCardHeader: {
            root: {
                padding: '16px 16px 0'
            }
        },
        MuiCardActions: {
            root: {
                backgroundColor: 'rgb(244, 245, 247)',
                padding: '16px'
            }
        },
        MuiLink: {
            root: {
                color: 'rgb(107, 119, 140)'
            }
        },
        MuiListItem: {
            root: {
                '&:hover': {
                    backgroundColor: defaultTheme.palette.action.hover
                }
            }
        },
        MuiPaper: {
            rounded: {
                borderRadius: '16px'
            }
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: '16px',
                backgroundColor: 'rgb(255,255,255)'
            }
        }
    }
});
