import BpmnModeler from "bpmn-js/lib/Modeler";

export function initBpmn(modeler: BpmnModeler): void {
  const bpmnXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><bpmn:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" id=\"Definitions_15rma01\" targetNamespace=\"http://bpmn.io/schema/bpmn\" exporter=\"bpmn-js (https://demo.bpmn.io)\" exporterVersion=\"15.1.3\"><bpmn:process id=\"Process_0pp9nzj\" isExecutable=\"false\"><bpmn:startEvent id=\"StartEvent_1w8qciu\" name=\"Log In\" /></bpmn:process><bpmndi:BPMNDiagram id=\"BPMNDiagram_1\"><bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_0pp9nzj\"><bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1w8qciu\"><dc:Bounds x=\"156\" y=\"82\" width=\"36\" height=\"36\" /><bpmndi:BPMNLabel><dc:Bounds x=\"159\" y=\"125\" width=\"31\" height=\"14\" /></bpmndi:BPMNLabel></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>";
  modeler.importXML(bpmnXML, (err:any, warnings:any) => {
    if (err) {
      console.error("Error importing BPMN diagram", err);
    } else {
      console.log("BPMN diagram imported successfully", warnings);
    }
  });
}