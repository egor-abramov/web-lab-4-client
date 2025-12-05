import React, { useState } from "react";
import './login.css'

function Welcome() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        login: '',
        password: ''
    });

    function handleChange(e) {
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
            const response = await fetch("http://localhost:8080/auth/register", {
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
                window.location.href = '/login';
            } else if (response.status === 403) {
                setErrors({
                    login: `User with login ${formData.login} alreadey exist`,
                    password: '',
                });
            } else {
                const errorData = await response.json().catch(() => ({}));
                
                setErrors({
                    login: errorData.login || '',
                    password: errorData.password || ''
                });
            }
        } catch(err) {
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

                    <button type="submit" className="login-btn" >Register</button>
                    <div id="login-link">
                        <a href="/login" className="redirect-link">Back</a>
                    </div>
                </form>
             </div>
        </main>
    );
}

export default Welcome;