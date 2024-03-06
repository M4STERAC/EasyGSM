import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

const SnackbarMessage = ({ message, open, handleClose, severity }: {message: string, open: boolean, handleClose: any, severity: 'success' | 'error' | 'info' | 'warning' }) => {
  const theme = useTheme();

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" onClick={handleClose}/>
      </IconButton>
    </>
  );

  return (
    <div>
      <Snackbar 
        sx={{ color: theme.palette.text.secondary }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        action={action}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SnackbarMessage;