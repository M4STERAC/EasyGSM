import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import { MainCardProps } from '../utils/types';


//Component that contains any information given to it and wraps it STYYYYYLLLEEE
const MainCard = ({children}: MainCardProps) => {
  const theme = useTheme();

  return (
  <Card sx={{
    bgcolor: theme.palette.background.default,
  }}>
    <CardContent>
      {children}
    </CardContent>
  </Card>
)};

export default MainCard;