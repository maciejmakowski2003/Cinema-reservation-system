import React, { useState } from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import { API_URL } from "../../config";
import axios from "axios";
import useSnackbar from "../../providers/SnackbarProvider";
import { Link } from "react-router-dom";
import useAuth from "../../providers/AuthProvider";
import { useNavigate } from 'react-router-dom';
import { saveToken } from "../../utils";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const { setText } = useSnackbar()
    const { setUser, setToken } = useAuth()
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post(`${API_URL}/users/login`, {
                email,
                password,
            })
            .then((res) => {
                saveToken(res.data.token)
                setText("Login successful!")
                setUser(res.data.user)
                setToken(res.data.token)
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
                    Login
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
                        margin="normal"
                        type="email"
                        required
                    />

                    <TextField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        type="password"
                        required
                    />
                    <Typography variant="subtitle1" color="black">
                        Don't have an account? <Link to="/sign-up">Sign up</Link>
                    </Typography>

                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        size="large"
                    >
                        LOGIN
                    </Button>
                </form>
            </Container>
        </Container>
    );
};

export default SignIn;
