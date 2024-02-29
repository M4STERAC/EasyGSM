import React from 'react';

//Mui Items
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


const MenuItem = ({ item }: any) => {
    return (
        <List>
            <ListItem>
                <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            </ListItem>
        </List>
    );
};

export default MenuItem;