import "./Login.css";
import PropTypes from "prop-types";
import React, { useState } from "react";

async function loginUser(credentials) {
    return fetch("https://senior-design-vbox.uc.r.appspot.com/login", {
        //https://ec2-3-86-224-254.compute-1.amazonaws.com:8080/login
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());

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
            <h1>Task Manager Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <div className="login-text">
                        <input
                            type="text"
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                </label>
                <label>
                    <p>Password</p>
                    <div className="login-text" >
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
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
