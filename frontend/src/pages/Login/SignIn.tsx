import React, { useState, FormEvent, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "./Card";
import { styled } from "@mui/material/styles";

import { login } from "../../services/authService";
import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router";
import { playerTurnSprite } from "../../config/assets";
import { useTimeouts } from "../../hooks/useTimeouts";
import { LoginModel } from "../../types/api";
import { loginBackgroundImage } from "../../config/login";
import { ROUTES } from '../../config/routes';

type Field = "email" | "password";

const capitalizeFirstLetter = (val: string) => val.charAt(0).toUpperCase() + val.slice(1);

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  minHeight: "100vh",
  width: "100vw",
  position: "relative",
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${loginBackgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    zIndex: -2,
  },
  "&::after": {
    content: '""',
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.4)",
    zIndex: -1,
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  maxWidth: "450px",
  width: "100%",
  position: "relative",
  zIndex: 1,
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  }
}));

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      void navigate(ROUTES.admin);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.body.classList.add('login-active');

    return () => {
      document.body.classList.remove('login-active');
    };
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [shaking, setShaking] = useState<Partial<Record<Field, boolean>>>({});
  const later = useTimeouts();

  const handleCloseErrorMessage = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorMessage(false);
  };

  const triggerError = (message: string, status: string) => {
    setErrorMessage(message);
    setErrorStatus(status);
    setOpenErrorMessage(true);
  };

  const setFieldError = (field: Field, message: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: capitalizeFirstLetter(message) }));
    setShaking((prev) => ({ ...prev, [field]: true }));
    later(() => setShaking((prev) => ({ ...prev, [field]: false })), 500);
  };

  // login accepts any password the server knows: no policy check here
  const validateInputs = () => {
    let isValid = true;
    if (!email.trim()) {
      setFieldError("email", "Please enter your email or username.");
      isValid = false;
    }
    if (!password) {
      setFieldError("password", "Please enter your password.");
      isValid = false;
    }
    return isValid;
  };

  const handleErrorField = (field: string, message: string) => {
    if (field === "email" || field === "password") {
      setFieldError(field, message);
    } else if (field === "unauthorized") {
      setFieldError("email", "");
      setFieldError("password", message);
    } else {
      triggerError(capitalizeFirstLetter(message), "error");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});

    if (!validateInputs()) {
      return;
    }

    const loginPayload: LoginModel = {
      identifier: email,
      password: password,
    };
    try {
      const loginToken = await login(loginPayload);
      if ("token" in loginToken) {
        triggerError("Login success!", "success");
        dispatch(loginSuccess({
          id: loginToken.id,
          user: loginToken.user,
          token: loginToken.token,
          expiration: loginToken.expiration,
        }));
      } else if (loginToken.fieldError && loginToken.error) {
        handleErrorField(loginToken.fieldError, loginToken.error);
      } else {
        triggerError("Something went wrong : " + loginToken.error, "error");
      }
    } catch (err) {
      triggerError("Something went wrong : " + err, "error");
    }
  };

  const emailError = fieldErrors.email !== undefined;
  const passwordError = fieldErrors.password !== undefined;

  return (
    <>
      <CssBaseline enableColorScheme />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openErrorMessage}
        autoHideDuration={2500}
        onClose={handleCloseErrorMessage}
        sx={{ zIndex: 9999 }}
      >
        <Alert onClose={handleCloseErrorMessage} severity={errorStatus === "error" ? "error" : "success"} sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <SignInContainer direction="column" justifyContent="center" alignItems="center">
        <StyledCard variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(1.5rem, 8vw, 2.15rem)",
              textAlign: "center",
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "#333",
              fontWeight: "bold"
            }}
          >
            {"Sign In"}
            <img
              style={{
                width: "50px",
                height: "50px",
                imageRendering: "pixelated"
              }}
              src={playerTurnSprite}
              alt="Character animation"
            />
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel
                htmlFor="email"
                sx={{
                  color: "#333",
                  fontWeight: "600",
                  "&.Mui-focused": {
                    color: "#1976d2"
                  }
                }}
              >
                {"Email / Username"}
              </FormLabel>
              <TextField
                error={emailError}
                helperText={fieldErrors.email}
                id="email"
                type="email"
                name="email"
                placeholder={"your@email.com or your_username"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                className={shaking.email ? "shake" : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    }
                  }
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel
                htmlFor="password"
                sx={{
                  color: "#333",
                  fontWeight: "600",
                  "&.Mui-focused": {
                    color: "#1976d2"
                  }
                }}
              >
                Password
              </FormLabel>
              <TextField
                error={passwordError}
                helperText={fieldErrors.password}
                name="password"
                placeholder="••••••••"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={"current-password"}
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
                className={shaking.password ? "shake" : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    }
                  }
                }}
              />
            </FormControl>

            <Button
              className="mt-3"
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: 2,
                padding: "12px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "8px",
                background: "#1976d2",
                "&:hover": {
                  background: "#1565c0",

                }
              }}
            >
              {"Sign In"}
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          </Box>
        </StyledCard>
      </SignInContainer>
    </>
  );
}