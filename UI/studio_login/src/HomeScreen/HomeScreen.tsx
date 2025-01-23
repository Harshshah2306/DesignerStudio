import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
  colors,
} from "@mui/material";
import React from "react";
import { Add, Logout, Delete } from "@mui/icons-material";

import tempData from "./test/processList.json";
import "./HomeScreen.css";
import HomePagination from "./PagerComponent";

import "./images/footer_img.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../variables";
import { useTranslation } from "react-i18next";

interface processListInterface {
  processId: string;
  processDescription: string;
}

function HomeScreen() {
  const navigate = useNavigate();
  const [requiredJSON, setRequiredJSON] = React.useState<
    Array<processListInterface>
  >([]);
  const [searchText, setSearchText] = React.useState<string>("");
  const [processList, setProcessList] = React.useState<
    Array<processListInterface>
  >([]);
  const [currentIndex, setCurrentIndex] = React.useState<number>(1);
  const { t } = useTranslation("common");

  //Four functionalities:
  // 1. Add a process
  // 2. delete a process

  const getTheRequiredProcessList = (
    givenList: any
  ): Array<processListInterface> => {
    let lastIndex = currentIndex * 8;
    let startIndex = lastIndex - 8;
    if (givenList[startIndex] && givenList[lastIndex]) {
      return givenList.slice(startIndex, lastIndex);
    }

    if (givenList[startIndex]) {
      return givenList.slice(startIndex, givenList.length);
    }

    return [];
  };

  React.useEffect(() => {
    if (searchText.length === 0) {
      setProcessList(requiredJSON);
    } else {
      let requiredArray = [];
      for (let i in requiredJSON) {
        if (requiredJSON[i].processId.includes(searchText)) {
          requiredArray.push(requiredJSON[i]);
        }
      }
      setProcessList(getTheRequiredProcessList(requiredArray));
    }
  }, [searchText.length]);

  React.useEffect(() => {
    console.log(currentIndex);
    setProcessList(getTheRequiredProcessList(requiredJSON));
  }, [currentIndex]);

  React.useEffect(() => {
    let requiredArray: Array<processListInterface> = JSON.parse(
      localStorage.getItem("processList") || "[]"
    );
    setRequiredJSON(requiredArray);
    setProcessList(getTheRequiredProcessList(requiredArray));
  }, []);

  const createProcess = () => {
    console.log("Create new process ...");
    axios
      .post(baseurl + "homeScreen/" + localStorage.getItem("username"))
      .then((res) => {
        if (res.status === 200) {
          let requiredObject: processListInterface = {
            processId: res.data.processId,
            processDescription: res.data.processDescription,
          };
          setProcessList([...processList, requiredObject]);
        } else {
          console.log("somethings went wrong");
        }
      })
      .catch((err) => {
        console.log("ERROR!, Something went wrong.", err);
      });
  };

  const deleteProcess = (requiredProcess: string) => {
    axios
      .delete(baseurl + "process/" + requiredProcess)
      .then((res) => {
        if (res.status === 200) {
          let requiredList = processList.filter(
            (currentProcess) => currentProcess.processId !== requiredProcess
          );
          setProcessList(requiredList);
        } else {
          console.log("somethings went wrong");
        }
      })
      .catch((err) => {
        console.log("ERROR!, Something went wrong.", err);
      });
  };

  return (
    <React.Fragment>
      <Grid
        className="HeaderContainer"
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{
          background:
            "linear-gradient(90deg, #000000 0%, #002F6C 35%, #0277BD 100%)",
          height: 100,
        }}
      >
        <Grid item md={4}>
          <Typography
            sx={{
              fontFamily: "Yeseva One",
              ml: 2,
              flex: 1,
              color: "white",
              // marginTop:'20px'
            }}
            variant="h4"
          >
            &nbsp;{t("title")}
          </Typography>
        </Grid>
        <Grid item md={7}></Grid>

        <Grid item md={1}>
          <Logout
            onClick={() => navigate("/signIn")}
            style={{
              color: "#fff",
              fontSize: "2.5rem",
            }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={4}
        style={{
          padding: "25px",
        }}
      >
        <Grid item md={6}></Grid>
        <Grid item md={3}>
          <TextField
            sx={{
              backgroundColor: "#fff",
            }}
            size="small"
            fullWidth
            label={t("ProcessID")}
            value={searchText}
            onChange={(evt) => setSearchText(evt.target.value)}
          />
        </Grid>
        <Grid item md={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={createProcess}
            startIcon={<Add />}
          >
            {t("NewProcess.label")}
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={4}
        style={{
          paddingRight: "25px",
          paddingLeft: "25px",
          height: "620px",
          overflowY: "scroll",
        }}
      >
        {processList.map((currentProcess) => {
          return (
            <Grid item md={3}>
              <Paper
                elevation={3}
                style={{ borderRadius: "15px" }}
                sx={{
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                  borderRadius: "15px",
                }}
              >
                <Grid
                  className="cardItem"
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  // bgcolor= "rgb(187, 222, 251)"
                >
                  <br />
                  <Grid item>
                    <Grid container spacing={1}>
                      <Grid item md={11}>
                        <Typography
                          variant="h4"
                          gutterBottom
                          sx={{
                            fontFamily: "Libre Baskerville",
                          }}
                        >
                          {currentProcess.processId}
                        </Typography>
                      </Grid>

                      <Grid item md={1}>
                        <Button
                          color="error"
                          onClick={() =>
                            deleteProcess(currentProcess.processId)
                          }
                          variant="outlined"
                        >
                          <Delete />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <div id="dividerHomeScreen" />
                  </Grid>

                  <Grid item sx={{ padding: "15px" }}>
                    <Typography
                      id="processDesc"
                      sx={{
                        width: "100%",
                        height: 100,
                        overflowY: "scroll",
                        fontFamily: "PT Mono",
                        padding: "2px",
                      }}
                      variant="subtitle1"
                      gutterBottom
                    >
                      {currentProcess.processDescription}
                    </Typography>
                  </Grid>

                  <Grid item style={{ width: "80%" }}>
                    <Grid container spacing={1} style={{ width: "100%" }}>
                      <Grid item md={5}>
                        <Button
                          color="primary"
                          fullWidth
                          onClick={() => {
                            localStorage.setItem(
                              "processId",
                              currentProcess.processId
                            );
                            navigate("/workFlowScreen");
                          }}
                          variant="contained"
                        >
                          Sandbox
                        </Button>
                      </Grid>
                      <Grid item md={2}></Grid>
                      <Grid item md={5}>
                        <Button
                          color="secondary"
                          fullWidth
                          onClick={() => {
                            localStorage.setItem(
                              "processId",
                              currentProcess.processId
                            );
                            navigate("/dynaScreen");
                          }}
                          variant="contained"
                        >
                          Production
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <br />
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <Grid item>
        <div className="BasicPaginationContainer">
          <HomePagination
            updateKey={(newKey: number) => setCurrentIndex(newKey)}
          />
        </div>
      </Grid>
      <Grid className="FooterContainer">
        <Grid className="leftFooter">
          © 2023 Team DesignerStudio. All rights reserved.
        </Grid>
        <Grid className="rightFooter"></Grid>
      </Grid>
    </React.Fragment>
  );
}

export default HomeScreen;
