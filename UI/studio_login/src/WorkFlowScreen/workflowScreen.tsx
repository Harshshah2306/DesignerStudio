import React from "react";
import BpmnComponent from "./components/BpmnComponent/BpmnComponent";
import dataset from './components/bpmnFile/dataset.json';
import { DndProvider } from "react-dnd";
import {HTML5Backend} from 'react-dnd-html5-backend';
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";


function App(){
  const [ processData, setProcessData] = React.useState<any>(dataset);
  const [ loading, setLoading] = React.useState<boolean>(true);
  // const bpmnXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><bpmn:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" id=\"Definitions_15rma01\" targetNamespace=\"http://bpmn.io/schema/bpmn\" exporter=\"bpmn-js (https://demo.bpmn.io)\" exporterVersion=\"15.1.3\"><bpmn:process id=\"Process_0pp9nzj\" isExecutable=\"false\"></bpmn:process><bpmndi:BPMNDiagram id=\"BPMNDiagram_1\"><bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_0pp9nzj\"></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>";
  React.useEffect(()=>{
    let processId = localStorage.getItem("processId") || "H001";
    axios.get("http://localhost:3000/process/"+processId)
    .then( res => {
      console.log(res.data);
      if( res.data.length == 1){
        setProcessData(JSON.parse( res.data[0].processDefinition));
        console.log(JSON.parse( res.data[0].processDefinition));
      } else {
        setProcessData(dataset);
      }
      setLoading(false);
    })
    .catch(error => {
      console.log('There is some error', error);
      setProcessData(dataset);
      setLoading(false);
    })
  }, []);
  return (
    <DndProvider backend={HTML5Backend}>
      {loading?(
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number; }; }) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ):(
        <BpmnComponent dataset={processData} />
      )}
      
    </DndProvider>
  );
};

export default App;
