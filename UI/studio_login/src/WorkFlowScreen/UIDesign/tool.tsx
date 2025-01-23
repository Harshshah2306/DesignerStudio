import React from 'react';
import {
    Typography
} from '@mui/material';
import {
    Edit,
    CalendarMonth,
    Numbers,
    Abc,
    Email,
    CheckBox,
    Key
} from '@mui/icons-material';
import { useDrag } from 'react-dnd';

interface CustomIconProps {
    src: string;
    style?: React.CSSProperties;
}

const CustomIcon: React.FC<CustomIconProps> = (props) => {
    switch (props.src) {
        case 'Edit':
            return (<Edit {...props} />);
        case 'CalendarMonth':
            return (<CalendarMonth {...props} />);
        case 'Numbers':
            return (<Numbers {...props} />);
        case 'Abc':
            return (<Abc {...props} />);
        case 'Email':
            return (<Email {...props} />);
        case 'Key':
            return (<Key {...props} />);
        case 'CheckBox':
            return (<CheckBox {...props} />);
        default:
            return null;
    }
}

interface ToolProps {
    currentField: {
        id: string;
        toolIcon: string;
        toolDescription: string;
        type:string;
    };
}

const itemTypes = {
    CARD : 'div'
}

const Tool: React.FC<ToolProps> = (props) => {
    const [{ isDragging }, drag] = useDrag({
        // item: {
        //     type: itemTypes.CARD,
        //     id: props.currentField.id
        // },
        type:'div',
        item:{
            id:props.currentField.id
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    });

    // const [{ isDragging }, dragRef] = useDrag(() => ({
    //     type: 'box',
    //     collect: (monitor) => ({
    //         isDragging: !!monitor.isDragging(),
    //     }),
    // }));



    return (
        <div
            ref={drag}
            id={props.currentField.id}
            style={{
                height: '50px',
                border: isDragging ? '2px solid #d81b60' : '1px solid #9e9e9e',
                width: '220px',
                borderRadius: '10px',
                margin: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left',
                paddingLeft: '10px',
            }}
        >
            <CustomIcon
                src={props.currentField.toolIcon}
                style={{
                    fontSize: '20'
                }}
            />
            <Typography variant='h6'>
                &nbsp;&nbsp;{props.currentField.toolDescription}
            </Typography>
        </div>
    )
}

export default Tool;
