import React from 'react';

//Mui Items
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';


const MenuItem = ({ item, onClick }: any) => {
    const theme = useTheme();

    return (
        <List>
            <ListItem sx={{ width: '100%', height: '5em' }}>
                <ListItemButton onClick={onClick}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            </ListItem>
        </List>
    );
};

export default MenuItem;