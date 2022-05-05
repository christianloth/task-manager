// Written By: Christian Loath

import "./Login.css";
import PropTypes from "prop-types";
import React, { useState } from "react";

async function loginUser(credentials) {
    const data = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());
    // Store all trip information into sessionStorage
    sessionStorage.setItem("user", data);
    console.log(data);
    return data;
}

export default function Login({ setToken }) {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password,
        });
        setToken(token);
    };

    return (
        <div className="login-wrapper">
            <h1>Task Manager Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <div className="login-text">
                        <input
                            type="text"
                            onChange={(e) => setUserName(e.target.value)}
                            value={username}
                            required
                        />
                    </div>
                </label>
                <label>
                    <p>Password</p>
                    <div className="login-text">
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                    </div>
                </label>
                <div className="button">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};
