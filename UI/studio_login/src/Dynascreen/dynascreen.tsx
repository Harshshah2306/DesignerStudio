import React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Grid,
  TextFieldProps,
  AppBar,
  Toolbar,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { baseurl } from "../variables";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { useNavigate } from "react-router-dom";

const FormField: React.FC<{ field: any }> = ({ field }) => {
  switch (field.fieldType) {
    case "TEXT":
      return <TextField label={field.fieldName} fullWidth margin="normal" />;
    case "PASSWORD":
      return (
        <TextField
          label={field.fieldName}
          type="password"
          fullWidth
          margin="normal"
        />
      );
    case "CHECKBOX":
      return (
        <FormControlLabel control={<Checkbox />} label={field.fieldName} />
      );
    case "DATE":
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer sx={{ padding: "0px" }} components={["DatePicker"]}>
            <DatePicker label={field.fieldName} sx={{ width: "500px" }} />
          </DemoContainer>
        </LocalizationProvider>
      );
    case "NUMBER":
      return (
        <TextField
          label={field.fieldName}
          type="number"
          fullWidth
          margin="normal"
        />
      );
    case "TEXTONLY":
      return <TextField label={field.fieldName} fullWidth margin="normal" />;
    case "EMAIL":
      return (
        <TextField
          type="email"
          label={field.fieldName}
          fullWidth
          margin="normal"
        />
      );
    default:
      return null;
  }
};

interface fieldInterface {
  fieldName: string;
  fieldType: string;
}

const FormPage: React.FC = () => {
  const [processId, setProcessId] = React.useState<string | null>(null);
  const [stepId, setStepId] = React.useState<string | null>(null);
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const [stepName, setStepName] = React.useState<string | null>(null);
  const [stepType, setStepType] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [responsesList, setResponsesList] = React.useState<Array<string>>([]);
  const [fields, setFields] = React.useState<Array<fieldInterface>>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    let currentProcess = localStorage.getItem("processId");
    setProcessId(currentProcess);
    axios
      .get(baseurl + "dynaScreen/" + currentProcess)
      .then((res) => {
        if (res.status === 200) {
          setStepId(res.data.stepId);
          setTransactionId(res.data.transactionId);
          setStepName(res.data.stepName);
          setStepType(res.data.stepType);
          setFields(res.data.fields);
          setResponsesList(res.data.responses);
          setIsLoading(false);
        } else {
          alert("Error! Something went wrong. Please go back!");
          setIsLoading(true);
        }
      })
      .catch((err) => {
        alert("Error! Something went wrong. Please go back!");
        console.log("Something went wrong!, ", err);
        setIsLoading(true);
      });
  }, []);

  const handleSubmit = (currentButton: any) => {
    console.log("clicked: ", currentButton.id);
    axios
      .put(
        baseurl +
          "dynaScreen/" +
          processId +
          "/" +
          stepId +
          "/" +
          currentButton.id
      )
      .then((res) => {
        if (res.status === 200) {
          alert("Form submitted successfully.");
          navigate("/homeScreen");
        } else {
          alert("Error! Something went wrong. Please go back!");
        }
      })
      .catch((err) => {
        alert("Error! Something went wrong. Please go back!");
        console.log("Something went wrong!, ", err);
      });
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme: { zIndex: { drawer: number } }) =>
              theme.zIndex.drawer + 1,
          }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <React.Fragment>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h4" style={{ display: "flex" }}>
                <PublishedWithChangesIcon
                  style={{
                    fontSize: "2rem",
                    marginTop: "2px",
                  }}
                />
                &nbsp;&nbsp;Process : {processId} | {stepName} : {stepType} |{" "}
                {transactionId}
              </Typography>
            </Toolbar>
          </AppBar>

          <Grid
            container
            style={{
              background:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,144,170,1) 35%, rgba(120,173,210,1) 100%)",
            }}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item md={2}></Grid>
            <Grid
              item
              md={8}
              sx={{ paddingTop: "18px", paddingBottom: "18px" }}
            >
              <Card variant="outlined">
                <CardContent style={{ height: "625px", overflowY: "scroll" }}>
                  <Grid container spacing={4}>
                    {fields.map((field, index) => (
                      <Grid item key={index} md={6}>
                        <FormField field={field} />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
                <Grid container spacing={4} sx={{ padding: "20px" }}>
                  {responsesList.map((currentResponse) => {
                    return (
                      <Grid item md={6}>
                        <Button
                          id={currentResponse}
                          fullWidth
                          variant="contained"
                          onClick={(evt) => handleSubmit(evt.target)}
                          color="primary"
                        >
                          {currentResponse}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
                <br />
              </Card>
            </Grid>
            <Grid item md={2}></Grid>
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default FormPage;
