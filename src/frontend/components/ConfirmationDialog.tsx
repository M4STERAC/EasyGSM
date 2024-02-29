import React, { useState } from 'react';
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
import { ConfirmationDialogProps } from '../utils/types';

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
    <Backdrop sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1}}
    open={isOpen}>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth={width}
        disableEscapeKeyDown={true}
        color={theme.palette.background.default}
      >
        <DialogTitle variant='h4' sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.common.white,
          alignContent: 'center'
        }}>{title}</DialogTitle>
        <Divider />
        <DialogContent sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.common.white,
        }}>
          <DialogContentText id="alert-dialog-slide-description">{children}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.common.white,
        }}>
          {buttons.map((button, index) => (
            <Button key={index} onClick={handleClose}>{button.text}</Button>
          ))}
        </DialogActions>
      </Dialog>
    </Backdrop>
  );
}

export default ConfirmationDialog;