import React, { useEffect, useRef } from "react";
import Modeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import {
  Grid,
  Box,
  Paper,
  Typography,
  TextField,
  Autocomplete,
  Fab,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  UIDesignerState,
  elementDefinition,
} from "../../store/UIDesigner/UIDesigner-slice";
import "../../UIDesign/designerScreen.css";
import NavigationIcon from "@mui/icons-material/Navigation";
import DesignerScreenUtility from "../../UIDesign/designerScreenUtility";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface BpmnComponentProps {
  dataset: UIDesignerState;
}

interface scanObjInterface {
  elementName: string;
  elementType: string;
}

interface sourceInterface {
  source: string;
  elementId: string;
}

interface targetInterface {
  target: string;
  elementId: string;
}

// const bpmnXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><bpmn:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" id=\"Definitions_15rma01\" targetNamespace=\"http://bpmn.io/schema/bpmn\" exporter=\"bpmn-js (https://demo.bpmn.io)\" exporterVersion=\"15.1.3\"><bpmn:process id=\"Process_0pp9nzj\" isExecutable=\"false\"></bpmn:process><bpmndi:BPMNDiagram id=\"BPMNDiagram_1\"><bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_0pp9nzj\"></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>";

const BpmnComponent: React.FC<BpmnComponentProps> = ({ dataset }) => {
  const ref = useRef<any>(null);
  const { t } = useTranslation("common");
  const propertiesPanelRef = useRef<HTMLInputElement>(null);
  const [selectedItem, setSelectedItem] = React.useState<string>("");
  const [elementList, setElementList] = React.useState<Array<string>>([]);
  const [selectedResponses, setSelectedResponses] = React.useState<
    Array<string>
  >([]);
  const [processDefinition, setProcessDefinition] =
    React.useState<UIDesignerState>(dataset);
  const [respondOptions] = React.useState<Array<string>>([
    "Submit",
    "Approve",
    "Completed",
    "Reject",
    "Decline",
    "Accept",
  ]);
  const [allActions] = React.useState<Array<string>>(["Save", "Deploy"]);
  const [selectedAction, setSelectedAction] = React.useState<string | null>(
    "Save"
  );
  const [showUIDesign, setShowUIDesign] = React.useState<boolean>(false);
  const getTheResponses = (requiredId: string): Array<string> => {
    try {
      if (processDefinition.elements[requiredId]) {
        return processDefinition.elements[requiredId].responses;
      }
    } catch (err) {
      console.log(err);
      return [];
    }

    return [];
  };
  const [msg, setMsg] = React.useState<string>("");
  const [showMsg, setShowMsg] = React.useState<boolean>(false);

  const addNewTask = (item: any): elementDefinition => {
    return {
      elementId: item,
      elementName: "",
      responses: [],
      elementType: "",
      fields: [],
    };
  };

  const getTheUpdatedElements = (responses: any): any => {
    try {
      let requiredElements = JSON.parse(
        JSON.stringify({ ...processDefinition.elements })
      );
      requiredElements[selectedItem].responses = responses;
      return requiredElements;
    } catch (err) {
      console.log(err);
      return { ...processDefinition.elements };
    }
  };

  const [bpmnModelerMain, setBpmnModelerMain] = React.useState<Modeler | null>(
    null
  );

  React.useEffect(() => {
    if (elementList.length !== 0) {
      let requiredID = elementList[elementList.length - 1];
      if (!processDefinition.elements[requiredID]) {
        setProcessDefinition({
          ...processDefinition,
          elements: {
            ...processDefinition.elements,
            [requiredID]: addNewTask(requiredID),
          },
        });
      }
    }
  }, [elementList.length]);

  React.useEffect(() => {
    setSelectedResponses(getTheResponses(selectedItem));
  }, [selectedItem]);

  useEffect(() => {
    const bpmnModeler = new Modeler({
      container: ref.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current,
      },
      canvas: {
        zoom: "fit-viewport",
      },
    });

    //pinpoint
    let parser = new DOMParser();
    let xmlData = parser.parseFromString(
      processDefinition.bpmn,
      "application/xml"
    );
    let requiredObject: Record<string, any> = {
      ...scanObjects(xmlData, "bpmn:startEvent"),
      ...scanObjects(xmlData, "bpmn:userTask"),
    };
    // setElementList(Object.keys(requiredObject));
    console.log(Object.keys(requiredObject));

    bpmnModeler.importXML(processDefinition.bpmn);
    var eventBus: any = bpmnModeler.get("eventBus");
    var events = ["element.click"];

    events.forEach(function (event) {
      eventBus.on(event, function (e: any) {
        if (e.element.id.substring(0, 8) === "Process_") {
          setSelectedItem(processDefinition.processId);
        } else {
          if (elementList.includes(e.element.id)) {
            setSelectedItem(e.element.id);
          } else {
            setSelectedItem(e.element.id);
            elementList.push(e.element.id);
          }
        }
      });
    });

    setBpmnModelerMain(bpmnModeler);
  }, []);

  const scanObjects = (
    xmlData: Document,
    type: string
  ): Record<string, Object> => {
    let events = xmlData.getElementsByTagName(type);
    let requiredArray: Record<string, scanObjInterface> = {};

    for (let i = 0; i < events.length; i++) {
      requiredArray[events[i].id] = {
        elementName: events[i].attributes[1]
          ? events[i].attributes[1].value
          : "",
        elementType: type,
      };
    }
    return requiredArray;
  };

  const getTheEvent: any = (xmlData: Document) => {
    let events = xmlData.getElementsByTagName("bpmn:sequenceFlow");

    let requiredData = [];
    for (let i = 0; i < events.length; i++) {
      let evt = events[i];
      let newItem = [];
      let event = events[i].attributes;

      for (let j = 0; j < event.length; j++) {
        if (event[j].name === "sourceRef") {
          let sourceObject: sourceInterface = {
            source: evt.attributes[j].value,
            elementId: evt.id,
          };
          newItem.push(sourceObject);
        } else if (event[j].name === "targetRef") {
          let targetObject: targetInterface = {
            target: evt.attributes[j].value,
            elementId: evt.id,
          };
          newItem.push(targetObject);
        }
      }
      requiredData.push(newItem);
    }
    return requiredData;
  };

  const handleSubmit = () => {
    if (selectedAction === "Save") {
      axios
        .put(
          "http://localhost:3000/process/" + processDefinition.processId,
          processDefinition
        )
        .then((res) => {
          if (res.status === 200) {
            console.log("Data is being uploaded");
            setMsg("Success! Process is saved.");
            setShowMsg(true);

            let allProcess = JSON.parse(
              localStorage.getItem("processList") || "[]"
            );
            for (let i in allProcess) {
              if (allProcess[i].processId === processDefinition.processId) {
                allProcess[i].processDescription =
                  processDefinition.processDescription;
              }
            }

            localStorage.setItem("processList", JSON.stringify(allProcess));
          } else if (res.status === 500) {
            setMsg("Failed! Process is not saved.");
            setShowMsg(true);

            console.log("Something went Wrong!");
          }
        })
        .catch((err) => {
          setMsg("Failed! Process is not saved.");
          setShowMsg(true);

          console.log(
            "Something went Wrong! SAVING PROCESS DEFINITION" + err.message
          );
        });
    } else {
      let parser = new DOMParser();
      let xmlData = parser.parseFromString(
        processDefinition.bpmn,
        "application/xml"
      );
      let requiredObject: any = getTheEvent(xmlData);

      axios
        .post("http://localhost:3000/process/" + processDefinition.processId, {
          ...processDefinition,
          xmlConnectors: requiredObject,
        })
        .then((res) => {
          if (res.status === 200) {
            console.log("Data is being uploaded");
            setMsg("Success! Process is saved.");
            setShowMsg(true);
          } else if (res.status === 500) {
            console.log("Something went Wrong!");
            setMsg("Failed! Process is not saved.");
            setShowMsg(true);
          }
        })
        .catch((err) => {
          setMsg("Failed! Process is not saved.");
          setShowMsg(true);
          console.log("Something went Wrong! SAVING PROCESS DEFINITION" + err);
        });
    }
  };

  return (
    <React.Fragment>
      <DesignerScreenUtility
        open={showUIDesign}
        handleClose={() => setShowUIDesign(false)}
        processDefinition={processDefinition}
        updateProcessDefinition={(updates) => setProcessDefinition(updates)}
      />

      <Fab
        id="designerEvt"
        variant="extended"
        color="success"
        onClick={async () => {
          if (bpmnModelerMain !== null) {
            bpmnModelerMain
              .saveXML({ format: true, preamble: true })
              .then((res) => {
                if (res.xml) {
                  let parser = new DOMParser();
                  let xmlData = parser.parseFromString(
                    res.xml,
                    "application/xml"
                  );

                  let requiredObject: Record<string, any> = {
                    ...scanObjects(xmlData, "bpmn:startEvent"),
                    ...scanObjects(xmlData, "bpmn:userTask"),
                  };
                  let updatedElements = { ...processDefinition.elements };

                  for (let key in updatedElements) {
                    if (requiredObject[key]) {
                      updatedElements[key] = {
                        ...updatedElements[key],
                        ...requiredObject[key],
                      };
                    }
                  }

                  setProcessDefinition({
                    ...processDefinition,
                    bpmn: res.xml,
                    elements: updatedElements,
                  });
                  setShowUIDesign(true);
                }
              });
          }
        }}
      >
        <NavigationIcon sx={{ mr: 1 }} />
        UI Design
      </Fab>

      <Grid container spacing={3}>
        <Grid item md={9}>
          <div ref={ref} style={{ height: 815 }} />
        </Grid>
        <Grid item md={3} style={{ backgroundColor: "rgba(2,0,36,1)" }}>
          <Grid
            container
            alignItems="center"
            direction="column"
            justifyContent="center"
            style={{
              marginTop: "8px",
              marginLeft: "-5px",
            }}
          >
            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: "310px",
                    height: 300,
                  },
                }}
              >
                <Paper elevation={3} style={{ borderRadius: "15px" }}>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <br />
                    <Grid item>
                      <Typography variant="h4" gutterBottom>
                        {t("ProcessDetails.label")}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <div id="divider1" />
                    </Grid>
                    <br />
                    <br />

                    <Grid item>
                      <TextField
                        label="Process Name"
                        value={processDefinition.processName}
                        size="small"
                        style={{ width: "250px" }}
                        onChange={(evt) => {
                          console.log(evt.target.value);
                          console.log(processDefinition);
                          setProcessDefinition({
                            ...processDefinition,
                            processName: evt.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <br />
                    <br />

                    <Grid item>
                      <TextField
                        label="Process Description"
                        defaultValue="Small"
                        size="small"
                        style={{ width: "250px" }}
                        multiline={true}
                        maxRows={6}
                        minRows={6}
                        value={processDefinition.processDescription}
                        onChange={(evt) =>
                          setProcessDefinition({
                            ...processDefinition,
                            processDescription: evt.target.value,
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
                  display: "flex",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: "310px",
                    height: 235,
                  },
                }}
              >
                <Paper elevation={3} style={{ borderRadius: "15px" }}>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <br />
                    <Grid item>
                      <Typography variant="h4" gutterBottom>
                        {t("SelectedElement.label")}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <div id="divider2" />
                    </Grid>
                    <br />
                    <br />

                    <Grid item>
                      <TextField
                        placeholder="SelectedItem"
                        id="outlined-size-small"
                        value={selectedItem}
                        size="small"
                        style={{ width: "250px" }}
                      />
                    </Grid>
                    <br />
                    <br />

                    <Grid item>
                      {selectedItem !== processDefinition.processId ? (
                        <React.Fragment>
                          {selectedItem.substring(0, 5) === "Flow_" ? (
                            <TextField
                              label="Expression"
                              value={
                                processDefinition.sequenceFlows[selectedItem]
                                  ? processDefinition.sequenceFlows[
                                      selectedItem
                                    ]
                                  : ""
                              }
                              size="small"
                              style={{ width: "250px" }}
                              onChange={(evt) =>
                                setProcessDefinition({
                                  ...processDefinition,
                                  sequenceFlows: {
                                    ...processDefinition.sequenceFlows,
                                    [selectedItem]: evt.target.value,
                                  },
                                })
                              }
                            />
                          ) : (
                            <Autocomplete
                              size="small"
                              multiple
                              limitTags={2}
                              id="multiple-limit-tags"
                              options={respondOptions}
                              getOptionLabel={(option) => option}
                              value={selectedResponses}
                              renderInput={(params) => (
                                <TextField {...params} label="Responses" />
                              )}
                              getOptionDisabled={(value) =>
                                selectedResponses.length > 1 ? true : false
                              }
                              onChange={(event, newValue) => {
                                setSelectedResponses(newValue);
                                setProcessDefinition({
                                  ...processDefinition,
                                  elements: getTheUpdatedElements(newValue),
                                });
                              }}
                              sx={{ width: "250px" }}
                            />
                          )}
                        </React.Fragment>
                      ) : null}
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Grid>

            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: "310px",
                    height: 218,
                  },
                }}
              >
                <Paper elevation={3} style={{ borderRadius: "15px" }}>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <br />
                    <Grid item>
                      <Typography variant="h4" gutterBottom>
                        {t("Action.label")}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <div id="divider3" />
                    </Grid>
                    <br />
                    <br />

                    <Grid item>
                      <Autocomplete
                        size="small"
                        options={allActions}
                        getOptionLabel={(option) => option}
                        value={selectedAction}
                        renderInput={(params) => (
                          <TextField {...params} label="Action" />
                        )}
                        onChange={(event, newValue) =>
                          setSelectedAction(newValue)
                        }
                        sx={{ width: "250px" }}
                      />
                    </Grid>

                    <br />
                    <br />
                    <Grid item>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth={true}
                        sx={{ width: "250px" }}
                        size="large"
                        onClick={handleSubmit}
                      >
                        {t("Proceed.label")}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showMsg}
        autoHideDuration={3000}
        onClose={() => setShowMsg(false)}
      >
        <Alert
          onClose={() => setShowMsg(false)}
          severity="info"
          sx={{
            width: "100%",
          }}
        >
          <b>{msg}</b>
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default BpmnComponent;
