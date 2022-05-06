import "./Login.css";
import PropTypes from "prop-types";
import React, { useState } from "react";

async function loginUser(credentials) {
    return fetch("http://localhost:3001/api/login", {
        //https://ec2-3-86-224-254.compute-1.amazonaws.com:8080/login
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })
        .then((data) => data.json())
        .catch((e) => console.log(e));

    // Store all trip information into sessionStorage
}

export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

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
            <h1>Log Into Task Manager</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input
                        type="text"
                        onChange={(e) => setUserName(e.target.value)}
                        style={{ color: "black" }}
                    />
                </label>
                <label>
                    <p>Password</p>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ color: "black" }}
                    />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};
