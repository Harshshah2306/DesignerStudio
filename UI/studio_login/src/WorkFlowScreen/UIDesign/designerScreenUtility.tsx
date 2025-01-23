import * as React from 'react';
import {
    Button,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    // Slide,
    Grid,
    Paper,
    TextField,
    Autocomplete,
    Snackbar,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import toolKitDataset from './toolkit.json';

import Tool from './tool';
import { useDrop } from 'react-dnd';
// import {
//     addField,
//     updateRedux,
//     deleteField,
//     editField,
//     reduxState
// } from './store/UIDesigner/action';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import { AppDispatch } from '../store/store';

import CustomField from './customField';

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

import {
    getRedux,
    addField,
    loadRedux,
    deleteField,
    editField
} from '../store/UIDesigner/UIDesigner-slice';

export default function DesignerScreenUtility(props: {
    open: boolean;
    handleClose: () => void;
    processDefinition: any; // Replace 'any' with actual type
    updateProcessDefinition: (updatedDefinition: any) => void; // Replace 'any' with actual type
}) {
    const [allSteps, setAllSteps] = React.useState<{ name: string; id: string }[]>([{
        name: "INIT",
        id: "EVENT_INIT"
    }]);
    const [selectedStep, setSelectedStep] = React.useState<number>(0);
    // const myState = useSelector((state) => state.UIDesignerReducer);
    const myState = useSelector(getRedux());

    // const dispatch = useDispatch();
    const dispatch = useDispatch<AppDispatch>();

    const [currentFields, setCurrentFields] = React.useState<any[]>([]);
    const [reRenderScreen, setReRenderScreen] = React.useState(0);
    const [showEdit, setShowEdit] = React.useState(false);
    const [editData, setEditData] = React.useState<{ id: number; value: string }>({ id: 0, value: '' });
    const [showMsg, setShowMsg] = React.useState(false);

    React.useEffect(() => {
        if (allSteps[selectedStep] && myState.elements[allSteps[selectedStep].id]) {
            let requiredFields = myState.elements[allSteps[selectedStep].id].fields.map((fieldId: number) => ({
                ...myState.fieldDefinitions[fieldId],
                fieldId: fieldId,
            }));

            setCurrentFields(requiredFields);
        } else {
            setCurrentFields([]);
        }
    }, [selectedStep, reRenderScreen]);

    const addImageToBoard = (item: any) => {
        dispatch(
            addField({
                fieldType: toolKitDataset[parseInt(item.id) - 1].type,
                elementId: allSteps[selectedStep].id,
            })
        );
        setReRenderScreen(reRenderScreen + 1);
    };

    const [{ isOver }, drop] = useDrop({
        accept: 'div',
        drop: (item) => addImageToBoard(item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });


    React.useEffect(() => {
        if (props.open) {
            dispatch(loadRedux(props.processDefinition));

            let allStepIds = Object.keys(props.processDefinition.elements);
            let requiredArray: { name: string; id: string }[] = [];
            for (let i in allStepIds) {
                if (
                    props.processDefinition.elements[allStepIds[i]].elementType === "bpmn:startEvent" ||
                    props.processDefinition.elements[allStepIds[i]].elementType === "bpmn:userTask"
                ) {
                    requiredArray.push({
                        name: props.processDefinition.elements[allStepIds[i]].elementName,
                        id: allStepIds[i],
                    });
                }
            }
            setAllSteps(requiredArray);

            if (requiredArray.length > 0) {
                setSelectedStep(0);
            }
        }
    }, [props.open]);

    const handleDelete = (id: number) => {
        dispatch(
            deleteField({
                fieldId: id,
                elementId: allSteps[selectedStep].id,
            })
        );
        setReRenderScreen(reRenderScreen + 1);
    };

    const handleEdit = (data: { id: number; value: string }) => {
        setEditData(data);
        setShowEdit(true);
    };

    const handleSave = () => {
        setShowMsg(true);
        props.updateProcessDefinition(myState);
    };

    return (
        <Dialog fullScreen open={props.open} onClose={props.handleClose} 
            // TransitionComponent={Transition}
        >
            <AppBar style={{ backgroundColor: 'rgba(2,0,36,1)' }} sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h5" component="div">
                        UI Design
                    </Typography>
                </Toolbar>
            </AppBar>

            <br />

            <Grid container spacing={4} style={{ padding: '20px' }}>
                <Grid item md={3}>
                    <Autocomplete
                        size="small"
                        options={allSteps}
                        getOptionLabel={(option) => option.name}
                        value={allSteps[selectedStep]?allSteps[selectedStep]:{id:'x',name:'x'}}
                        renderInput={(params) => <TextField {...params} label="List of Steps: " />}
                        onChange={(event, newValue) => {
                            for (let i = 0; i < allSteps.length; i++) {
                                if (newValue?.id === allSteps[i].id) {
                                    setSelectedStep(i);
                                    break;
                                }
                            }
                        }}
                        fullWidth={true}
                    />
                </Grid>

                {showEdit ? (
                    <>
                        <Grid item md={3}>
                            <TextField
                                fullWidth
                                label="New Value"
                                value={editData.value}
                                onChange={(evt) =>
                                    setEditData({
                                        ...editData,
                                        value: evt.target.value,
                                    })
                                }
                                size="small"
                            />
                        </Grid>
                        <Grid item md={1}>
                            <Button
                                color="primary"
                                fullWidth
                                variant="contained"
                                onClick={() => {
                                    if (editData.value.length === 0) {
                                        return;
                                    }
                                    dispatch(
                                        editField({
                                            fieldId: editData.id,
                                            fieldName: editData.value,
                                        })
                                    );
                                    setReRenderScreen(reRenderScreen + 1);
                                    setShowEdit(false);
                                }}
                            >
                                <b>Proceed</b>
                            </Button>
                        </Grid>
                        <Grid item md={1}>
                            <Button
                                color="error"
                                fullWidth
                                variant="contained"
                                onClick={() => {
                                    setShowEdit(false);
                                }}
                            >
                                <b>Cancel</b>
                            </Button>
                        </Grid>
                        <Grid item md={1}></Grid>
                    </>
                ) : (
                    <Grid item md={6}></Grid>
                )}

                <Grid item md={3}>
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth={true}
                        size="large"
                        onClick={handleSave}
                    >
                        <b>Save Progress</b>
                    </Button>
                </Grid>
            </Grid>

            <br />

            <Grid
                style={{
                    marginTop: '0px',
                    background:
                        'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,144,170,1) 35%, rgba(120,173,210,1)100%)',
                    padding: '20px',
                    paddingBottom: '30px',
                    paddingTop: '0px',
                }}
                container
                spacing={4}
            >
                <Grid item md={3}>
                    <Paper
                        style={{
                            borderRadius: '12px',
                            height: '583px',
                        }}
                        elevation={3}
                    >
                        <Grid container alignItems="center" direction="column" justifyContent="center">
                            <br />
                            <Grid item md={12}>
                                <Typography variant="h4" gutterBottom>
                                    Toolbox
                                </Typography>
                            </Grid>

                            <Grid item>
                                <div id="divider3" />
                            </Grid>
                            <br />

                            {toolKitDataset.map((currentField) => (
                                <Tool currentField={currentField} />
                            ))}
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item md={9}>
                    <Paper
                        elevation={3}
                        style={{
                            borderRadius: '12px',
                            height: '583px',
                        }}
                    >
                        <Grid container alignItems="center" direction="column" justifyContent="center">
                            <br />
                            <Grid item md={12}>
                                <Typography variant="h4" gutterBottom>
                                    Step: {allSteps[selectedStep] ? allSteps[selectedStep].name : 'N/A'}
                                </Typography>
                            </Grid>

                            <Grid item>
                                <div id="divider4" />
                            </Grid>
                            <br />

                            <div
                                ref={drop}
                                style={{
                                    width: '94%',
                                    backgroundColor:isOver ? '#fce4ec' : '#fff',
                                    height: '500px',
                                    overflowY: 'auto',
                                }}
                            >
                                <Grid container spacing={4}>
                                    {currentFields.map((currentField) => (
                                        <CustomField
                                            key={currentField.fieldId}
                                            data={currentField}
                                            deleteField={handleDelete}
                                            editField={handleEdit}
                                        />
                                    ))}
                                </Grid>
                            </div>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={showMsg}
                autoHideDuration={3000}
                onClose={() => setShowMsg(false)}
            >
                <Alert
                    onClose={() => setShowMsg(false)}
                    severity="success"
                    sx={{
                        width: '100%',
                    }}
                >
                    <b>Success, Process Definition is updated!</b>
                </Alert>
            </Snackbar>
        </Dialog>
    );
}
