import React from 'react';
import {
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
    InputAdornment,
    IconButton,
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface CustomFieldProps {
    data: {
        fieldType: string;
        fieldName: string;
        fieldId: number;
    };
    deleteField: (fieldId: number) => void;
    editField: (data: { id: number; value: string }) => void;
}

const CustomField: React.FC<CustomFieldProps> = (props) => {
    const Element: React.FC<any> = (props) => {
        switch (props.data.fieldType) {
            case 'TEXT':
                return <TextField {...props} />;
            case 'DATE':
                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer sx={{ padding: '0px' }} components={['DatePicker']}>
                            <DatePicker label="Basic date picker" {...props} sx={{ width: '500px' }} />
                        </DemoContainer>
                    </LocalizationProvider>
                );
            case 'NUMBER':
                return <TextField type="number" {...props} />;
            case 'TEXTONLY':
                return <TextField type="text" {...props} />;
            case 'EMAIL':
                return <TextField type="email" {...props} />;
            case 'PASSWORD':
                return <TextField type="password" {...props} />;
            case 'CHECKBOX':
                return (
                    <Grid container spacing={1}>
                        <Grid item md={10}>
                            <FormControlLabel control={<Checkbox />} {...props} />
                        </Grid>
                        <Grid item md={2} style={{ paddingLeft: '15px' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => props.editField({ id: props.data.fieldId, value: props.data.fieldName })}
                                aria-label="close"
                                sx={{ padding: '5px' }}
                            >
                                <ModeEditIcon />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                onClick={() => props.deleteField(props.data.fieldId)}
                                aria-label="close"
                                sx={{ padding: '5px' }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Grid item md={6}>
            <Element
                label={props.data.fieldType + ': ' + props.data.fieldName}
                fullWidth
                // deleteField={props.deleteField}
                // editField={props.editField}
                InputProps={{
                    endAdornment: (
                        <React.Fragment>
                            <InputAdornment position="end">
                                <IconButton
                                    color="inherit"
                                    onClick={() => props.editField({ id: props.data.fieldId, value: props.data.fieldName })}
                                    aria-label="close"
                                    sx={{ padding: '0px' }}
                                >
                                    <ModeEditIcon />
                                </IconButton>
                            </InputAdornment>
                            <InputAdornment position="end">
                                <IconButton
                                    color="inherit"
                                    onClick={() => props.deleteField(props.data.fieldId)}
                                    aria-label="close"
                                    sx={{ padding: '0px' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </InputAdornment>
                        </React.Fragment>
                    ),
                }}
                {...props}
            />
        </Grid>
    );
};

export default CustomField;
