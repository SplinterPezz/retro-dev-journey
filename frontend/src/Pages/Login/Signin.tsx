import React, { useState, FormEvent, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "../../Components/Common/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import { SitemarkIcon } from "../../Components/Common/CustomIcons";
import { login } from "../../Services/authService";
import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { LoginModel } from "../../types/api";

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState("");

  // State for input errors
  const [emailError, setEmailError] = useState(false);
  const [emailShake, setEmailShake] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordShake, setPasswordShake] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameShake, setUsernameShake] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

  const [open, setOpen] = useState(false);

  const handleCloseErrorMessage = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorMessage(false);
  };

  const triggerError = (message: string, status:string) => {
    setErrorMessage(message);
    setErrorStatus(status)
    setOpenErrorMessage(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = () => {
    let isValid = true;

    const validatePassword = (password_data: string) => {
      let hasMinLen = false;
      let hasUpper = false;
      let hasLower = false;
      let hasNumber = false;
      let hasSpecial = false;

      // Check minimum length
      if (password_data.length >= 8) {
        hasMinLen = true;
      }

      // Iterate over each character in the password
      for (const char of password_data) {
        if (/[A-Z]/.test(char)) {
          hasUpper = true;
        } else if (/[a-z]/.test(char)) {
          hasLower = true;
        } else if (/[0-9]/.test(char)) {
          hasNumber = true;
        }
        else if (/[\p{P}\p{S}]/u.test(char)) {
        // Check for punctuation or symbols using Unicode properties
          hasSpecial = true;
        }
      }

      // Check all conditions
      return hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial;
    };

    const validateEmail = (emailData: string) => {
      if (!emailData) return "Please enter a valid email address.";
      return "";
    };


    const errorMessage = validateEmail(email);

    if (errorMessage) {
      emailErrorImpl(errorMessage);
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Password validation
    if (!password || !validatePassword(password)) {
      var messagePassword =
        "Password should be 8+ characters with uppercase, lowercase, number, and special character";
      passwordErrorImpl(messagePassword);
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleErrorField = (field: string, message: string) => {
    switch (field) {
      case "email":
        emailErrorImpl(message);
        break;
      case "password":
        passwordErrorImpl(message);
        break;
      case "unauthorized":
        emailErrorImpl("");
        passwordErrorImpl(message);
        break;
      default:
        usernameErrorImpl(message);
        break;
    }
  };

  function emailErrorImpl(message: string) {
    setEmailError(true);
    setEmailShake(true);
    setTimeout(() => {
      setEmailShake(false);
    }, 500);
    setEmailErrorMessage(capitalizeFirstLetter(message));
  }
  function passwordErrorImpl(message: string) {
    setPasswordError(true);
    setPasswordShake(true);
    setTimeout(() => {
      setPasswordShake(false);
    }, 500);
    setPasswordErrorMessage(capitalizeFirstLetter(message));
  }
  function usernameErrorImpl(message: string) {
    setUsernameError(true);
    setUsernameShake(true);
    setTimeout(() => {
      setUsernameShake(false);
    }, 500);
    setUsernameErrorMessage(capitalizeFirstLetter(message));
  }

  function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    resetErrors();

    // Validate inputs first
    if (!validateInputs()) {
      return;
    }

    const loginPayload: LoginModel = {
      email: email,
      password: password,
    };
    try {
      const loginToken = await login(loginPayload);
      if ("token" in loginToken) {
        triggerError('Login success!', "success")

        //set loginToken.token and loginToken.expiration and email to store
        dispatch(loginSuccess({
          id: loginToken.id,
          user: loginToken.user,
          token: loginToken.token,
          expiration: loginToken.expiration,
        }));
        
      } else if (loginToken.fieldError && loginToken.error) {
        handleErrorField(loginToken.fieldError, loginToken.error);
      } else {
        triggerError('Something went wrong : '+ loginToken.error, "error")
      }
    } catch (err) {
      triggerError('Something went wrong : '+ err, "error")
    }
  };

  const resetErrors = () => {
    setEmailError(false);
    setEmailErrorMessage("");
    setPasswordError(false);
    setPasswordErrorMessage("");
    setUsernameError(false);
    setUsernameErrorMessage("");
  };

  const toggleAuthMode = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    resetErrors();
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openErrorMessage}
        autoHideDuration={2500}
        onClose={handleCloseErrorMessage}
      >
        <Alert onClose={handleCloseErrorMessage} severity={errorStatus === "error" ? "error":"success"} sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            {"Sign In"}
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
              <FormLabel htmlFor="email">
                {"Email / Username"}
              </FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
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
                className={emailShake ? "shake" : ""}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••••"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={"current-password"}
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
                className={passwordShake ? "shake" : ""}
              />
            </FormControl>

            <ForgotPassword open={open} handleClose={handleClose} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ "primary.main &:hover": "primary.dark"}}
            >
              {"Sign In"}
            </Button>

            <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                Forgot your password?
              </Link>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
}
