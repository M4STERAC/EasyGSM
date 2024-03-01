import React, { useState, useContext, useEffect } from "react";
import { createUTCDate, generateId } from "../utils/generalFunctions";
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
import { useNavigate, useLocation } from "react-router-dom";
import Card from "./MainCard";
import "../css/UpdateDatabase.css";
import "../css/ButtonStyles.css";
import "../css/Forms.css";

//MUI Items
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Backdrop from '@mui/material/Backdrop';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import Alert from '@mui/material/Alert';
import TextField from "@mui/material/TextField";

const UpdateDatabase = (props: any) => {
  const { isUpdate } = props;
  const navigate = useNavigate();
  const [state, setState] = useContext(StoreContext);
  const [id] = useState(isUpdate ? state.selectedServer.id : generateId(10));
  const [game, setGame] = useState(isUpdate ? state.selectedServer.game : "");
  const [name, setName] = useState(isUpdate ? state.selectedServer.name : "");
  const [executable, setExecutable] = useState(isUpdate ? state.selectedServer.executable : "");
  const [saveDirectory, setSaveDirectory] = useState(isUpdate ? state.selectedServer.saveDirectory : "");
  const [banlist, setBanlist] = useState(isUpdate ? state.selectedServer.banlist : "");
  const [ports, setPorts] = useState(isUpdate ? state.selectedServer.ports : "");
  const [backuptime, setBackupTime] = useState("06:00");
  const [errors, setErrors] = useState({ banlistError: "", portError: "", pathError: "", requiredFieldsError: "" } as Error);
  const [isOpen, setOpen] = useState(true);


  const theme = useTheme();
  // const { width, title, buttons, children } = props;


  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


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
    const requiredFieldsValidated = validateRequiredFieldsFilled(game, name, executable, saveDirectory);
    const banlistValidated = validateIpAddress(banlist);
    const portsValidated = validatePort(ports);
    const executableValidated = validateFilePath(executable);
    const saveDirectoryValidated = validateFilePath(saveDirectory);

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
      id,
      game,
      name,
      executable,
      saveDirectory,
      banlist,
      ports,
      backuptime,
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
        game,
        ports,
        backuptime,
        saveDirectory,
      } as Server));
    })
    .catch((error: any) => console.error(error));
  };

  const deleteServer = () => {
    //Ask the user if they're sure they want to delete the server and/or the ports
    window.electron.invoke("dialog-box", {
      checkboxLabel: "Would you like to delete the open ports used for this server?",
      checkboxChecked: false,
    })
    .then((response: DialogBoxRespone) => {
      if (response.response !== 0) return;
      //Delete the server and/or the ports
      window.electron.invoke("delete-server", { id })
      .then(() => {
        setState((prevState: any) => {
          const serverList = prevState.serverList;
          const index = serverList.findIndex((server: Server) => server.id === id);
          if (index !== -1) serverList.splice(index, 1);
          return { ...prevState, serverList, selectedServer: null };
        })
        console.debug("Offboard Result: ", offboardServer(
          { game, ports, backuptime, saveDirectory } as Server,
          response.checkboxChecked
        ));
      })
      .catch((error: any) => console.error('Delete Server Error: ', error));
    })
    .catch((error: any) => console.error('Dialog Box Error: ', error));
  };

  const handleClose = (__: React.SyntheticEvent, __1?: string) => {
    setState((prevState: any) => ({ ...prevState, addServerDialogOpen: false }));
  };


  return (
    <Backdrop sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1}}open={state.addServerDialogOpen}>
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
          color: theme.palette.common.white,
          alignContent: 'center'
        }}>{isUpdate ? 'Update' : 'Create'} Server</DialogTitle>

        <Divider />

        <DialogContent sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.common.white,
        }}>
          {isUpdate && !state.selectedServer ? (<p className="error">Failed to get Server Configuration. Please try again later.</p>) : (

            //Form goes here
            <form>
              {errors.requiredFieldsError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField id="outlined-basic" label="Game" variant="outlined" />

              {errors.requiredFieldsError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField id="outlined-basic" label="Name" variant="outlined" />

              {errors.requiredFieldsError || errors.pathError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField id="outlined-basic" label="Path to Executable" variant="outlined" />

              {errors.requiredFieldsError || errors.pathError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField id="outlined-basic" label="Path to Save Directory" variant="outlined" />

              {errors.banlistError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField id="outlined-basic" label="Banlist" variant="outlined" />

              <p>Required Ports:</p>

              {errors.portError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField id="outlined-basic" label="TCP Inbound" variant="outlined" />

              {errors.portError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField id="outlined-basic" label="TCP Outbound" variant="outlined" />

              {errors.portError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField id="outlined-basic" label="UDP Inbound" variant="outlined" />

              {errors.portError ? <Alert severity="error">{errors.requiredFieldsError}</Alert> : null}
              <TextField id="outlined-basic" label="UDP Outbound" variant="outlined" />

              <div className="button-container">
                <div className="submit-cancel-container">
                  <Button variant="contained" onClick={handleSubmit}>Save</Button>
                  <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                </div>
                {isUpdate ? <Button variant="outlined" onClick={deleteServer}>Delete</Button> : null}
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Backdrop>
  );
};

export default UpdateDatabase;
