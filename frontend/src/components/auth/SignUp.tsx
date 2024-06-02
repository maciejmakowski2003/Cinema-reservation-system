import React, { useState } from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import { API_URL } from "../../config";
import axios from "axios";
import useSnackbar from "../../providers/SnackbarProvider";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../providers/AuthProvider";
import { saveToken } from "../../utils";
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const { setText } = useSnackbar()
    const { setUser, setToken } = useAuth()
    const navigate = useNavigate()
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== password2) {
            alert("Passwords don't match");
            return;
        }
        axios
            .post(`${API_URL}/users/signup`, {
                email,
                password,
            })
            .then((res) => {
                setText("Sign up successful!")
                setUser(res.data.user)
                setToken(res.data.token)
                saveToken(res.data.token)
                setTimeout(() => navigate("/cinemas"), 2000)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Container
            style={{
                padding: "20px",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Container
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    maxWidth: "500px",
                }}
            >
                <Typography variant="h4" color="black">
                    Sign Up
                </Typography>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        // fullWidth
                        margin="normal"
                        type="email"
                        required
                    />

                    <TextField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // fullWidth
                        margin="normal"
                        type="password"
                        required
                    />

                    <TextField
                        label="Confirm Password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        // fullWidth
                        margin="normal"
                        type="password"
                        required
                    />
                    <Typography variant="subtitle1" color="black">
                        Already have an account? <Link to="/sign-in">Log in</Link>
                    </Typography>
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        size="large"
                    >
                        Sign Up
                    </Button>
                </form>
            </Container>
        </Container>
    );
};

export default SignUp;