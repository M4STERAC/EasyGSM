import React, { ReactNode } from 'react';
import { PopUpBoxProps, PopUpBoxSize } from '../utils/types';



const PopUpBox: React.FC<PopUpBoxProps> = ({ size, children }) => {
    const { width, height } = size;

    return (
        <div style={{ width, height }}>
            {children}
        </div>
    );
};

export default PopUpBox;