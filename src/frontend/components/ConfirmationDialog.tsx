import React, { useState, useContext } from 'react';
import { StoreContext } from "../Store";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Backdrop from '@mui/material/Backdrop';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { ConfirmationDialogButton, ConfirmationDialogProps } from '../utils/types';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const { width, title, buttons, children } = props;
  const [isOpen, setOpen] = useState(true);
  const theme = useTheme();


  const handleClose = (__: React.SyntheticEvent, reason?: string) => {
    if (reason === 'backdropClick') return;
    setOpen(false);
  };

  return (
    <Backdrop sx={{ zIndex: theme.zIndex.drawer + 1 }}
    open={isOpen}>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth={width}
        disableEscapeKeyDown={true}
      >
        <DialogTitle variant='h4' sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          alignContent: 'center'
        }}>{title}</DialogTitle>
        <Divider />
        <DialogContent sx={{
          backgroundColor: theme.palette.background.default,
        }}>
          <DialogContentText sx={{ color: theme.palette.text.primary }} id="alert-dialog-slide-description">{children}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}>
          {buttons.map((button: ConfirmationDialogButton, index: number) => (
            <Button key={index} 
            onClick={() => { 
              if (button.func) button.func();
              handleClose({} as any, ''); 
            }}>{button.text}</Button>
          ))}
        </DialogActions>
      </Dialog>
    </Backdrop>
  );
}

export default ConfirmationDialog;