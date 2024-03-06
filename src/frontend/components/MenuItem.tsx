import React, { useState } from 'react';

//Mui Items
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';


const MenuItem = ({ item, onClick }: any) => {
    const [hover, setHover] = useState(false);
    const theme = useTheme();

    return (
        <ListItem onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} sx={{ width: '100%', height: '5em' }}>
            <ListItemButton onClick={onClick} sx={{width: '100%', height: '100%', "&:hover": { backgroundColor: theme.palette.primary.light, color: theme.palette.text.secondary }}}>
                <ListItemIcon>{React.cloneElement(item.icon, { sx: { color: !hover ? theme.palette.text.primary : theme.palette.text.secondary } })}</ListItemIcon>
                <ListItemText primary={item.text} />
            </ListItemButton>
        </ListItem>
    );
};


export default MenuItem;