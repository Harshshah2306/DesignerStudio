
import React, { Component } from 'react';
import './designerScreen.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import requiredJson from './dataset.json';
import NavigationIcon from '@mui/icons-material/Navigation';

import { 
    Grid, 
    Box, 
    Paper, 
    Typography, 
    TextField,
    Autocomplete,
    Fab,
    Button
} from '@mui/material';
import DesignerScreenUtility from './designerScreenUtility';

function getTheXML(xmlStr) {
    return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
}

export default class DesignerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processDefinition: requiredJson,
            bpmn: getTheXML(requiredJson.bpmn),
            selectedItem: requiredJson.processId,
            respondOptions : [
                'Submit',
                'Approve',
                'Completed',
                'Reject',
                'Decline',
                'Accept'
            ],
            selectedResponses : [],
            showUIDesign : false,
            selectedAction: null,
            allActions : [
                'Save',
                'Deploy',
                'Save & Deploy'
            ],
            elementList : {}
        };

        this.requiredModeler = React.createRef();
        // this.setSelected = this.setSelected.bind(this);
    }

    addNewTask( item ){
        return {
            [item.element.id] : {
                "elementId": item.element.id,
                "elementName": null,
                "responses": [],
                "elementType": item.element.type,
                "fields" : []
            }
        };
    }

    getTheResponses( requiredId ){
        return this.state.processDefinition.elements[requiredId].responses;
    }

    componentDidMount() {
        // this.init();
        const container = this.requiredModeler.current;
        this.bpmnViewer = new BpmnModeler({ container });
        this.bpmnViewer.importXML(this.state.processDefinition.bpmn);
        this.bpmnViewer.get('canvas').zoom('fit-viewport');

        var eventBus = this.bpmnViewer.get('eventBus');
        var events = [
            'element.click',
        ];

        const setSelected = ( item ) => {
            if( this.state.elementList[item.element.id] ){
                this.setState({
                    selectedItem: item.element.id,
                    selectedResponses : this.getTheResponses(item.element.id)
                });
            }
            else{
                this.setState({
                    selectedItem : item.element.id,
                    elementList : { 
                        ...this.state.elementList, 
                        [item.element.id]:true
                    },
                    processDefinition : {
                        ...this.state.processDefinition,
                        elements : {
                            ...this.state.processDefinition.elements,
                            ...this.addNewTask(item)
                        }
                    },
                    selectedResponses : []
                })
            }
        }

        const setSelectedToProcessName = () => this.setState({selectedItem:this.state.processDefinition.processId});

        events.forEach(function(event) {
            eventBus.on(event, function(e) {
                console.log("Selected an element: ", e);
                if( e.element.id.substring(0,8) === 'Process_'){
                    setSelectedToProcessName();
                }
                else{
                    setSelected({...e});
                }
            });
        });
    }

    async getTheXML( modeler ){
        const { xml } = await modeler.saveXML({ format: true, preamble:true })
        return xml
    }

    scanObjects( xmlData, type){
        let events = xmlData.getElementsByTagName(type);
        let requiredArray = {};

        for(let i=0; i<events.length; i++) {            
            requiredArray[events[i].id] = {
                elementName: events[i].attributes[1]?events[i].attributes[1].value:'',
                elementType: type
            };
        }
        return requiredArray;
    }

    getTheUpdatedElements( responses ) {
        let requiredElements = {...this.state.processDefinition.elements};
        requiredElements[this.state.selectedItem].responses = responses;
        return requiredElements;
    }

    render() {
        return (
            <React.Fragment>
                <DesignerScreenUtility
                    open = {this.state.showUIDesign}
                    handleClose = {()=>this.setState({showUIDesign:false})}
                    processDefinition = {this.state.processDefinition}
                    updateProcessDefinition = {(updates)=>this.setState({processDefinition:updates})}
                />
                <Fab 
                    id = 'designerEvt'
                    variant="extended" 
                    color="success"
                    onClick = {()=> {
                        this.getTheXML(this.bpmnViewer).then( res => {
                            let parser = new DOMParser();
                            let xmlData = parser.parseFromString(res,"application/xml");
                            let requiredObject = {
                                ...this.scanObjects( xmlData, "bpmn:startEvent"),
                                ...this.scanObjects( xmlData, "bpmn:userTask")
                            };
                            let updatedElements = {...this.state.processDefinition.elements};
                            for( let key in updatedElements){
                                if( requiredObject[key] ) {
                                    updatedElements[key] = {
                                        ...updatedElements[key],
                                        ...requiredObject[key]
                                    };
                                }
                            }

                            this.setState({
                                showUIDesign: true,
                                processDefinition: {
                                    ...this.state.processDefinition,
                                    bpmn : res,
                                    elements : updatedElements
                                }
                            });
                        });
                    }}
                >
                    <NavigationIcon sx={{ mr: 1 }} />
                    UI Design
                </Fab>

                <Grid container spacing={3}>
                    <Grid item md={9}>
                        <div 
                            style={{height:815}}
                            id="js-canvas"
                            ref={ this.requiredModeler } 
                        />
                    </Grid>
                    <Grid item md={3} style={{backgroundColor:'rgba(2,0,36,1)'}}>
                        <Grid 
                            container 
                            alignItems='center'
                            direction="column" 
                            justifyContent="center"
                            style={{
                                marginTop: '8px',
                                marginLeft: '-5px'
                            }}
                            >
                            <Grid item>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        '& > :not(style)': {
                                        m: 1,
                                        width: '310px',
                                        height: 300,
                                        },
                                    }}
                                >
                                    <Paper elevation={3} style={{borderRadius:'15px'}}>
                                        <Grid 
                                            container 
                                            direction="column" 
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <br/>
                                            <Grid item>
                                                <Typography variant="h4" gutterBottom>
                                                    Process Details
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <div id='divider1'/>
                                            </Grid>
                                            <br/><br/>

                                            <Grid item>
                                                <TextField
                                                    label="Process ID"
                                                    value={this.state.processDefinition.processName}
                                                    size="small"
                                                    style={{width:'250px'}}
                                                    onChange={(evt)=> this.setState({
                                                            processDefinition:{
                                                                ...this.state.processDefinition,
                                                                processName: evt.target.value
                                                            }
                                                        })
                                                    }
                                                />
                                            </Grid>
                                            <br/><br/>

                                            <Grid item>
                                                <TextField
                                                    label="Process Description"
                                                    defaultValue="Small"
                                                    size="small"
                                                    style={{width:'250px'}}
                                                    multiline={true}
                                                    maxRows={6}
                                                    minRows={6}
                                                    value={this.state.processDefinition.processDescription}
                                                    onChange={(evt)=> this.setState({
                                                            processDefinition:{
                                                                ...this.state.processDefinition,
                                                                processDescription: evt.target.value
                                                            }
                                                        })
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>
                            </Grid>

                            <Grid item>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        '& > :not(style)': {
                                        m: 1,
                                        width: '310px',
                                        height: 235,
                                        },
                                    }}
                                >
                                    <Paper elevation={3} style={{borderRadius:'15px'}}>
                                        <Grid 
                                            container 
                                            direction="column" 
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <br/>
                                            <Grid item>
                                                <Typography variant="h4" gutterBottom>
                                                    Selected Element
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <div id='divider2'/>
                                            </Grid>
                                            <br/><br/>

                                            <Grid item>
                                                <TextField
                                                    placeholder="SelectedItem"
                                                    id="outlined-size-small"
                                                    value={this.state.selectedItem}
                                                    size="small"
                                                    style={{width:'250px'}}
                                                />
                                            </Grid>
                                            <br/><br/>

                                            <Grid item>
                                                {this.state.selectedItem !== this.state.processDefinition.processId?(
                                                    <React.Fragment>
                                                        {this.state.selectedItem.substring(0,5)==='Flow_'?(
                                                            <TextField
                                                                label="Expression"
                                                                value={
                                                                    this.state.processDefinition.sequenceFlows[this.state.selectedItem]?
                                                                    this.state.processDefinition.sequenceFlows[this.state.selectedItem]:
                                                                    ''
                                                                }
                                                                size="small"
                                                                style={{width:'250px'}}
                                                                onChange={(evt)=> this.setState({
                                                                        processDefinition:{
                                                                            ...this.state.processDefinition,
                                                                            sequenceFlows: {
                                                                                ...this.state.processDefinition.sequenceFlows,
                                                                                [this.state.selectedItem]:evt.target.value
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            />
                                                        ):(
                                                            <Autocomplete
                                                                size='small'
                                                                multiple
                                                                limitTags={2}
                                                                id="multiple-limit-tags"
                                                                options={this.state.respondOptions}
                                                                getOptionLabel={(option) => option}
                                                                value={this.state.selectedResponses}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} label="Responses" />
                                                                )}
                                                                getOptionDisabled={(value)=>this.state.selectedResponses.length>1?true:false}
                                                                onChange={(event, newValue) =>  this.setState({
                                                                    selectedResponses : newValue,
                                                                    processDefinition: {
                                                                        ...this.state.processDefinition,
                                                                        elements : this.getTheUpdatedElements( newValue )
                                                                    }
                                                                })}
                                                                sx={{ width: '250px' }}
                                                            />
                                                        )}
                                                    </React.Fragment>
                                                ):null}
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>
                            </Grid>

                            <Grid item>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        '& > :not(style)': {
                                        m: 1,
                                        width: '310px',
                                        height: 218,
                                        },
                                    }}
                                >
                                    <Paper elevation={3} style={{borderRadius:'15px'}}>
                                        <Grid                                            
                                            container 
                                            direction="column" 
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <br/>
                                            <Grid item>
                                                <Typography variant="h4" gutterBottom>
                                                    Action
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <div id='divider3'/>
                                            </Grid>
                                            <br/><br/>

                                            <Grid item>
                                                <Autocomplete
                                                    size='small'
                                                    options={this.state.allActions}
                                                    getOptionLabel={(option) => option}
                                                    value={this.state.selectedAction}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Action" />
                                                    )}
                                                    onChange={(event, newValue) =>  this.setState({selectedAction:newValue})}
                                                    sx={{ width: '250px' }}
                                                />
                                            </Grid>

                                            <br/><br/>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color='success'
                                                    fullWidth={true}
                                                    sx={{ width: '250px' }}
                                                    size='large'
                                                >
                                                    Proceed
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid> 
            </React.Fragment>       
        );
    }
}


// var serializer = new XMLSerializer();
// var newXmlStr = serializer.serializeToString();