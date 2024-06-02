import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
interface SnackbarContexttState {
    text: string | null;
    setText: (text: string | null) => void;
}
type Props = {
    children: React.ReactNode;
}
const SnackbarContextt = React.createContext<SnackbarContexttState | undefined>(undefined);

const SnackbarProvider = ({ children }: Props) => {
    const [text, setText] = React.useState<string | null>(null);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setText(null);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <SnackbarContextt.Provider value={{ text, setText }}>
            {children}
            <Snackbar
                open={text !== null}
                autoHideDuration={4000}
                onClose={handleClose}
                message={text}
                action={action}
            />
        </SnackbarContextt.Provider>
    );
};
const useSnackbar = () => {
    const context = React.useContext(SnackbarContextt);

    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }

    return context;
};

export default useSnackbar;

export { SnackbarProvider, useSnackbar };