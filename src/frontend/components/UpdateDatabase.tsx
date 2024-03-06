import React, { useState, useContext, useEffect } from "react";
import { generateId } from "../utils/generalFunctions";
import {
  validateIpAddress,
  validatePort,
  validateFilePath,
  validateRequiredFieldsFilled,
  sanitizeAlphanumeric,
  sanitizeFilePath,
  sanitizePorts,
  sanitizeIpAddress,
} from "../utils/dataValidation";
import { Error } from "../utils/types";
import {
  onboardServer,
  offboardServer,
} from "../utils/onboard-offboard-server";
import { StoreContext } from "../Store";
import "../css/UpdateDatabase.css";
import "../css/ButtonStyles.css";
import "../css/Forms.css";

//MUI Items
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Backdrop from '@mui/material/Backdrop';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import Alert from '@mui/material/Alert';
import TextField from "@mui/material/TextField";
import Tooltip from '@mui/material/Tooltip';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const UpdateDatabase = (props: any) => {
  const theme = useTheme();
  const { isUpdate } = props;
  const [state, setState] = useContext(StoreContext);
  let updateServer = isUpdate ? state.selectedServer : {
    id: generateId(10),
    game: "",
    name: "",
    executable: "",
    saveDirectory: "",
    banlist: "",
    ports: {
      tcpinbound: "",
      tcpoutbound: "",
      udpinbound: "",
      udpoutbound: "",
    },
    backuptime: "06:00",
  }
  const [errors, setErrors] = useState({ banlistError: "", portError: "", pathError: "", requiredFieldsError: "" } as Error);
  const DefaultTextFieldStyle = {
    '& .MuiInputLabel-root': { color: theme.palette.primary.main },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: theme.palette.primary.main },
      '&:hover fieldset': { borderColor: theme.palette.primary.dark },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.light },
    },
    color: theme.palette.text.primary,
  }


  //Whenever an error is created, log it to the console
  useEffect(() => {
    const errs = Object.values(errors).toString().replaceAll(/[,\s]/g, "");
    if (errs !== "") console.error(errors);
  }, [errors]);


  //When the user submits the form, validate the data and save it to the database
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let postFail = false;

    //Validate all input fields
    const requiredFieldsValidated = validateRequiredFieldsFilled(updateServer.game, updateServer.name, updateServer.executable, updateServer.saveDirectory);
    const banlistValidated = validateIpAddress(updateServer.banlist);
    const portsValidated = validatePort(updateServer.ports);
    const executableValidated = validateFilePath(updateServer.executable);
    const saveDirectoryValidated = validateFilePath(updateServer.saveDirectory);

    //If any of the fields are invalid, set the errors and return
    if (requiredFieldsValidated !== true || portsValidated !== true || banlistValidated !== true || executableValidated !== true || saveDirectoryValidated !== true) {
      setErrors((prevState: any) => ({ 
        ...prevState, 
        requiredFieldsError: requiredFieldsValidated !== true ? requiredFieldsValidated : "",
        banlistError: banlistValidated !== true ? banlistValidated : "",
        portError: portsValidated !== true ? portsValidated : "",
        pathError: (executableValidated !== true ? executableValidated : "") || (saveDirectoryValidated !== true ? saveDirectoryValidated : ""),
      }));
      postFail = true;
      return;
    } else postFail = false;

    if (postFail) return;
    //Post the database
    window.electron.invoke("save-server", {
      id: updateServer.id,
      game: updateServer.game,
      name: updateServer.name,
      executable: updateServer.executable,
      saveDirectory: updateServer.saveDirectory,
      banlist: updateServer.banlist,
      ports: updateServer.ports,
      backuptime: updateServer.backuptime,
    })
    .then((data: Server) => {
      setState((prevState: any) => {
        const serverList = prevState.serverList;
        const index = serverList.findIndex((server: Server) => server.id === data.id);
        data.status = "Down";
        if (index === -1) serverList.push(data);
        else serverList[index] = data;
        return { ...prevState, serverList, selectedServer: null };
      });
      console.debug("Onboard Result: ", onboardServer({
        game: updateServer.game,
        ports: updateServer.ports,
        backuptime: updateServer.backuptime,
        saveDirectory: updateServer.saveDirectory,
      } as Server));
      handleClose(e, "Save");
    })
    .catch((error: any) => console.error(error));
  };

  const deleteServer = (e: any) => {
    e.preventDefault();
    //Ask the user if they're sure they want to delete the server and/or the ports
    window.electron.invoke("dialog-box", {
      checkboxLabel: "Would you like to delete the open ports used for this server?",
      checkboxChecked: false,
    })
    .then((response: DialogBoxRespone) => {
      if (response.response !== 0) return;
      //Delete the server and/or the ports
      window.electron.invoke("delete-server", { id: updateServer.id })
      .then(() => {
        setState((prevState: any) => {
          const serverList = prevState.serverList;
          const index = serverList.findIndex((server: Server) => server.id === updateServer.id);
          if (index !== -1) serverList.splice(index, 1);
          return { ...prevState, serverList, selectedServer: null };
        })
        console.debug("Offboard Result: ", offboardServer(
          { game: updateServer.game, ports: updateServer.ports, backuptime: updateServer.backuptime, saveDirectory: updateServer.saveDirectory } as Server,
          response.checkboxChecked
        ));
        handleClose(e, "Delete");
      })
      .catch((error: any) => console.error('Delete Server Error: ', error));
    })
    .catch((error: any) => console.error('Dialog Box Error: ', error));
  };

  const handleClose = (__: React.SyntheticEvent, __1?: string) => {
    setState((prevState: any) => ({ ...prevState, addServerDialogOpen: false }));
  };


  return (
    <Backdrop sx={{ zIndex: theme.zIndex.drawer + 1 }}open={state.addServerDialogOpen}>
      <Dialog
        open={state.addServerDialogOpen}
        TransitionComponent={Transition}
        aria-describedby="alert-dialog-slide-description"
        onClose={handleClose}
        maxWidth='lg'
        color={theme.palette.background.default}
      >
        <DialogTitle variant='h4' sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          alignContent: 'center'
        }}>{isUpdate ? 'Update' : 'Create'} Server</DialogTitle>

        <Divider />

        <DialogContent sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}>
          {isUpdate && !state.selectedServer ? (<p className="error">Failed to get Server Configuration. Please try again later.</p>) : (

            //Form goes here
            <form>
              {errors.requiredFieldsError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField sx={DefaultTextFieldStyle} id="outlined-basic" label="Game" variant="outlined" placeholder={updateServer.game} onChange={(e) => updateServer.game = (sanitizeAlphanumeric(e.target.value))} />

              {errors.requiredFieldsError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField sx={DefaultTextFieldStyle} id="outlined-basic" label="Name" variant="outlined" placeholder={updateServer.name} onChange={(e) => updateServer.name = (sanitizeAlphanumeric(e.target.value))} />

              {errors.requiredFieldsError || errors.pathError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField sx={DefaultTextFieldStyle} id="outlined-basic" label="Path to Executable" variant="outlined" placeholder={updateServer.executable} onChange={(e) => updateServer.executable = (sanitizeFilePath(e.target.value))} />

              {errors.requiredFieldsError || errors.pathError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField sx={DefaultTextFieldStyle} id="outlined-basic" label="Path to Save Directory" variant="outlined" placeholder={updateServer.saveDirectory} onChange={(e) => updateServer.saveDirectory = (sanitizeFilePath(e.target.value))} />

              {errors.banlistError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField sx={DefaultTextFieldStyle} id="outlined-basic" label="Banlist" variant="outlined" placeholder={updateServer.banlist} onChange={(e) => updateServer.banlist = (sanitizeIpAddress(e.target.value))} />

              <p>Required Ports:</p>

              {errors.portError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField sx={DefaultTextFieldStyle} id="outlined-basic" label="TCP Inbound" variant="outlined" placeholder={updateServer.ports.tcpinbound} onChange={(e) => updateServer.ports = ({ ...updateServer.ports, tcpinbound: sanitizePorts(e.target.value) })} />

              {errors.portError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField sx={DefaultTextFieldStyle} id="outlined-basic" label="TCP Outbound" variant="outlined" placeholder={updateServer.ports.tcpoutbound} onChange={(e) => updateServer.ports = ({ ...updateServer.ports, tcpoutbound: sanitizePorts(e.target.value) })} />

              {errors.portError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField sx={DefaultTextFieldStyle} id="outlined-basic" label="UDP Inbound" variant="outlined" placeholder={updateServer.ports.udpinbound} onChange={(e) => updateServer.ports = ({ ...updateServer.ports, udpinbound: sanitizePorts(e.target.value) })} />

              {errors.portError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField sx={DefaultTextFieldStyle} id="outlined-basic" label="UDP Outbound" variant="outlined" placeholder={updateServer.ports.udpoutbound} onChange={(e) => updateServer.ports = ({ ...updateServer.ports, udpoutbound: sanitizePorts(e.target.value) })} />

              <div className="button-container">
                <div className="submit-cancel-container">
                  <Tooltip title='Saves server configuration' enterDelay={4000} arrow>
                    <Button variant="contained" onClick={handleSubmit}>Save</Button>
                  </Tooltip>
                  <Tooltip title='Closes form' enterDelay={4000} arrow>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                  </Tooltip>
                </div>
                {isUpdate ? 
                  <Tooltip title='Deletes selected server configuration' enterDelay={4000} arrow>
                    <Button variant="outlined" onClick={deleteServer}>Delete</Button>
                  </Tooltip> : null}
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Backdrop>
  );
};

export default UpdateDatabase;
