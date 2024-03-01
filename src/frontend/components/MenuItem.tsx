import React from 'react';

//Mui Items
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';


const MenuItem = ({ item }: any) => {
    return (
        <Box sx={{ width: 250 }} role="presentation">
            <List>
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
};

export default MenuItem;