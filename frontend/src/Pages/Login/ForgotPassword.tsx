import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const FancyDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "5px",
    padding: theme.spacing(2),
  },
}));

// Email validation function
const validateEmail = (email: string): string => {
  if (!email) return "Email is required.";
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) ? "" : "Please enter a valid email address.";
};

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateEmail(email);
    if (error) {
      setEmailError(true);
      setEmailErrorMessage(error);
      return;
    }

    setEmailError(false);
    setEmailErrorMessage("");
    alert("Password reset link sent to your email!");
    handleClose();
  };

  return (
    <FancyDialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Reset Password
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: "100%",
        }}
      >
        <DialogContentText sx={{ textAlign: "center", fontSize: "1rem", mb: 2 }}>
          Enter your account's email address, and we'll send you a link to reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          error={emailError}
          required
          id="email"
          name="email"
          placeholder="Email address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ borderRadius: "10px" }}
        />
        {emailError && (
          <Typography variant="caption" color="error">
            {emailErrorMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3, justifyContent: "center" }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Continue
        </Button>
      </DialogActions>
    </FancyDialog>
  );
}
