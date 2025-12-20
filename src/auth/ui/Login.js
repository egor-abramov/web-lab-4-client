import React, { useState } from "react";
import './login.css'
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../model/authSlice.js';
import { jwtDecode } from "jwt-decode";

function Welcome() {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        login: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
        ...prevState,
        [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login: formData.login,
                    password: formData.password
                })
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(setCredentials(data.accessToken));
                const decoded = jwtDecode(data.accessToken);
                if(decoded.role === "USER") {
                    window.location.href = '/';
                } else if (decoded.role === "ADMIN") {
                    window.location.href = "/admin";
                }
            } else {
                const json = await response.json().catch(() => ({}));
                
                setErrors(json.errors);
            } 
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <main className="container">
             <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>                    
                    <div className="form-group">
                    <label htmlFor="login">Login</label>
                    <input
                        type="text"
                        id="login"
                        name="login"
                        onChange={handleChange}
                        required
                    />
                    {errors.login && (
                        <span className="error-text" id="login-error">
                            {errors.login}
                        </span>
                    )}
                    </div>

                    <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={handleChange}
                        required
                    />
                    {errors.password && (
                        <span className="error-text" id="password-error">
                            {errors.password}
                        </span>
                    )}
                    </div>

                    <button type="submit" className="login-btn">Login</button>
                    <div id="registration-link">
                        <a href="/registration" className="redirect-link">Registration</a>
                    </div>
                </form>
             </div>
        </main>
    );
}

export default Welcome;