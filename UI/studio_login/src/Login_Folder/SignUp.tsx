import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Grid,
  TextField,
  Link,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  CssBaseline,
  createTheme,
} from "@mui/material";
import image1 from "./Picture1.png";
import image2 from "./Picture2.png";
import image3 from "./Picture3.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { baseurl } from "../variables";
import axios from "axios";
import { useTranslation } from "react-i18next";

function ImageSlider() {
  const sliderRef = React.useRef(null);
  const [animationDirection, setAnimationDirection] = React.useState("");

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

const SignUp: React.FC = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    if (event.target.value === "") {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const handleUsernameError = (): void => {
    if (username.length === 0) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (password.length === 0) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };
  const handlePasswordError = (): void => {
    if (password.length === 0) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleEmailError = (): void => {
    if (email.length === 0) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!username || !password || !email) {
      alert("Please fill in all fields");
      setUsernameError(true);
      setPasswordError(true);
      setEmailError(true);
      return;
    }

    try {
      axios
        .post(baseurl + "user", {
          USERNAME: username,
          EMAIL: email,
          PASSWORD: password,
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            alert("Successful!, The user is created successfully.");
          } else {
            alert("Failed!, The user is not created.");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Failed!, The user is not created.");
        });
    } catch (error) {
      console.error("Error during registration:", error);
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
            <br />
            <br />
            <Typography variant="h2" style={{ textAlign: "center" }} mb={6}>
              {t("SignUp.button.label")}
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t("Username.textfield.label")}
                  variant="outlined"
                  value={username}
                  onChange={handleUsernameChange}
                  error={usernameError}
                  onBlur={handleUsernameError}
                  helperText={usernameError ? "Username is required" : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t("Password.textfield.label")}
                  variant="outlined"
                  type="password"
                  value={password}
                  error={passwordError}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordError}
                  helperText={passwordError ? "Password is required" : ""}
                />
              </Grid>
            </Grid>
            <Box mt={4}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                onBlur={handleEmailError}
                helperText={emailError ? "Email is required" : ""}
              />
            </Box>
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                {t("submit.button.label")}
              </Button>
            </Box>
            <Box mt={2}>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link onClick={() => navigate("/signin")} variant="body2">
                    {t("MovetoSignIn.label")}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SignUp;
