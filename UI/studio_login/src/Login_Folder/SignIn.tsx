import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  CssBaseline,
  Box,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Grid,
  Link,
  ThemeProvider,
  createTheme,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import image1 from "./Picture1.png";
import image2 from "./Picture2.png";
import image3 from "./Picture3.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CopyrightIcon from "@mui/icons-material/Copyright";
import axios from "axios";
import { baseurl } from "../variables";
import { useTranslation } from "react-i18next";

function ImageSlider() {
  const sliderRef = React.useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings} ref={sliderRef}>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <img
          src={image1}
          alt="Image 1"
          style={{ width: "100%", verticalAlign: "center" }}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <img
          src={image2}
          alt="Image 2"
          style={{ verticalAlign: "center", height: "800px", width: "1200px" }}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <img
          src={image3}
          alt="Image 3"
          style={{ width: "100%", verticalAlign: "center", height: "800px" }}
        />
      </div>
    </Slider>
  );
}

const SignIn: React.FC = () => {
  const { t } = useTranslation("common");

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = useState<number>(0);

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const [passwordError, setPasswordError] = useState<boolean>(false);

  const handlePasswordError = (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const newPassword = event.target.value.trim();

    setValues({ ...values, password: newPassword });

    if (newPassword === "") {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const [userNameValue, setUserNameValue] = useState<string>("");
  const [userNameError, setUserNameError] = useState<boolean>(false);

  const handleUserNameError = (): void => {
    const newUserName = userNameValue.trim();
    setUserNameValue(newUserName);

    // Check if the field is empty or contains only whitespace
    const isFieldEmpty = newUserName === "" || /^\s*$/.test(newUserName);

    setUserNameError(isFieldEmpty);
  };

  const [sandboxValue, setSandboxValue] = useState({
    processId: "",
    sandboxPassword: "",
  });

  const [sandboxPasswordError, setSandboxPasswordError] =
    useState<boolean>(false);

  const handleSandboxPasswordError = (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const newSandboxPassword = event.target.value.trim();

    setSandboxValue({ ...sandboxValue, sandboxPassword: newSandboxPassword });

    if (newSandboxPassword === "") {
      setSandboxPasswordError(true);
    } else {
      setSandboxPasswordError(false);
    }
  };

  const [productionValue, setProductionValue] = useState({
    processId: "",
    transactionId: "",
    productionPassword: "",
  });

  const [productionPasswordError, setProductionPasswordError] =
    useState<boolean>(false);

  const handleProductionPasswordError = (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const newProductionPassword = event.target.value.trim();

    setProductionValue({
      ...productionValue,
      productionPassword: newProductionPassword,
    });

    if (newProductionPassword === "") {
      setProductionPasswordError(true);
    } else {
      setProductionPasswordError(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const isUsernameValid = userNameValue.length > 0;
  const isPasswordValid = values.password.length > 0;
  const isSandboxPasswordValid = sandboxValue.sandboxPassword.length > 0;
  const isProductionPasswordValid =
    productionValue.productionPassword.length > 0;

  const handleSubmit = async (): Promise<void> => {
    console.log(tabValue);
    if (isUsernameValid && isPasswordValid) {
      try {
        axios
          .get(
            baseurl +
              "user/?username=" +
              userNameValue +
              "&password=" +
              values.password
          )
          .then((res) => {
            // console.log(res.data.processList);
            localStorage.setItem(
              "processList",
              JSON.stringify(res.data.processList)
            );
            localStorage.setItem("username", userNameValue);
            navigate("/homeScreen");
            alert("Successful!, Valid Credentials");
          })
          .catch((err) => {
            console.log("Invalid credentials");
            alert("Failed Validation");
          });
      } catch (error) {
        console.error("Error during login:", error);
      }
    } else {
      alert("Failed Validation");
    }
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <div style={{ width: isSmallScreen ? "100%" : "75%" }}>
          <ImageSlider />
        </div>
        <div
          style={{
            width: isSmallScreen ? "100%" : "25%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: theme.spacing(4),
          }}
        >
          <Box
            style={{
              width: "100%",
              maxWidth: "400px",
              marginTop: theme.spacing(2),
            }}
          >
            <Box component="form">
              <Typography variant="h1" align="center" marginBottom={4}>
                {t("title")}
              </Typography>
              <br />
              <br />
              <br />
              {/* <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                aria-label="login type"
              >
                <Tab label="Sandbox" />
                <Tab label="Production" />
              </Tabs> */}

              {tabValue === 0 && (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    label={t("Username.textfield.label")}
                    required
                    value={userNameValue}
                    onChange={(evt) => {
                      setUserNameValue(evt.target.value);

                      if (evt.target.value.length === 0) {
                        setUserNameError(true);
                      } else {
                        setUserNameError(false);
                      }
                      // Reset error when the user types
                    }}
                    onBlur={handleUserNameError} // Validate on blur
                    error={userNameError}
                    helperText={userNameError ? "Username is required" : ""}
                  />
                  <TextField
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handlePasswordError}
                    onBlur={handlePasswordError} // Validate on blur
                    error={passwordError}
                    helperText={passwordError ? "Password is required" : ""}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {values.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    margin="normal"
                    label={t("Password.textfield.label")}
                    required
                  />
                </>
              )}

              {tabValue === 1 && (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    label={t("Username.textfield.label")}
                    required
                    value={userNameValue}
                    onChange={(evt) => {
                      setUserNameValue(evt.target.value);

                      if (evt.target.value.length === 0) {
                        setUserNameError(true);
                      } else {
                        setUserNameError(false);
                      }
                      // Reset error when the user types
                    }}
                    onBlur={handleUserNameError} // Validate on blur
                    error={userNameError}
                    helperText={userNameError ? "Username is required" : ""}
                  />
                  <TextField
                    type={values.showPassword ? "text" : "password"}
                    value={sandboxValue.sandboxPassword}
                    onChange={handleSandboxPasswordError}
                    onBlur={handleSandboxPasswordError} // Validate on blur
                    error={sandboxPasswordError}
                    helperText={
                      sandboxPasswordError ? "Password is required" : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {values.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    margin="normal"
                    label={t("Password.textfield.label")}
                    required
                  />
                </>
              )}

              <Box marginTop={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  {t("submit.button.label")}
                </Button>
              </Box>
              <Box marginTop={2}>
                <Grid container justifyContent={"flex-end"}>
                  <Grid item justifyContent={"flex-end"}>
                    <Button onClick={() => navigate("/signup")}>
                      {t("SignUp.button.label")}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>

          <Typography
            variant="subtitle1"
            style={{ marginTop: "175px", display: "flex" }}
          >
            <CopyrightIcon style={{ marginTop: "2px" }} />
            &nbsp;&nbsp;{t("Copyright.label")}
          </Typography>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SignIn;
