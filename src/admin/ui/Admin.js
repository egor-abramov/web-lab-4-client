import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from 'react-redux';
import { handleQuit } from '../../utils/handlers.js';
import { logout } from "../../auth/model/authSlice.js";
import { setUsersWinRate } from "../model/adminSlice.js";
import { apiFetch } from '../../utils/api.js'

function Admin() {
    const dispatch = useDispatch();
    const user = useSelector(s => s.auth.user);
    const accessToken = useSelector(s => s.auth.accessToken);
    const usersWinRate = useSelector(s => s.admin.usersWinRate);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAdminLogin, setNewAdminLogin] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");

    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");

    if (!user || user.role !== "ADMIN") {
        window.location.href = "/login";
    }

    useEffect(() => {
        async function loadUsers() {
            try {
                if (!accessToken) return;
                const result = await apiFetch("/admin", 'GET', accessToken);
                if (result) {
                    const data = await result.json();
                    dispatch(setUsersWinRate(data));
                }
            } catch (err) {
                window.location = "/login";
            }
        }

        loadUsers();
    }, [accessToken]);

    async function processQuit() {
        const result = await handleQuit(accessToken);
        if (result) {
            dispatch(logout());
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        let startUTC = null;
        let endUTC = null;

        if (startDateTime) {
            startUTC = new Date(startDateTime).toISOString();
        }

        if (endDateTime) {
            endUTC = new Date(endDateTime).toISOString();
        }

        let url = "/admin";
        const params = new URLSearchParams();
        if (startUTC) params.append("minDate", startUTC);
        if (endUTC) params.append("maxDate", endUTC);
        if (params.toString()) url += `?${params.toString()}`;

        const result = await apiFetch(url, 'GET', accessToken);
        if (result) {
            const data = await result.json();
            dispatch(setUsersWinRate(data));
        }
    }

    async function handleCreateAdmin(e) {
        e.preventDefault();
        setModalError("");
        setModalSuccess("");

        if (!newAdminLogin || !newAdminPassword) {
            setModalError("Enter both fields");
            return;
        }

        try {
            const response = await apiFetch("/admin/add", 'POST', accessToken, {
                body: {
                    login: newAdminLogin,
                    password: newAdminPassword
                }
            });
            if (response.ok) {
                setModalSuccess(`Admin "${newAdminLogin}" created`);
                setNewAdminLogin("");
                setNewAdminPassword("");
                setTimeout(() => {
                    setIsModalOpen(false);
                    setModalSuccess("");
                }, 1000);
            } else if(response.status === 409){
                setModalError("User already exists");
            } else {
                const errorData = await response.json();
                setModalError(errorData.password);
            }
        } catch (err) {
            setModalError("Server error");
        }
    }

    return (
        <main>
            <div className="container" style={{ position: "relative", minHeight: "100vh", paddingBottom: "80px" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "40px",
                }}>
                    <form onSubmit={handleSubmit} style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center"
                    }}>
                        <div className="form-group">
                            <label htmlFor="start-datetime">Min time</label>
                            <input
                                type="datetime-local"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                                style={{
                                    fontSize: "15px",
                                    borderRadius: "4px",
                                    width: "240px"
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end-datetime">Max time</label>
                            <input
                                type="datetime-local"
                                value={endDateTime}
                                onChange={(e) => setEndDateTime(e.target.value)}
                                style={{
                                    fontSize: "15px",
                                    borderRadius: "4px",
                                    width: "240px"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                marginTop: "29px",
                                padding: "8px 20px",
                                fontSize: "15px",
                                backgroundColor: "#1976d2",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                height: "40px"
                            }}
                        >
                            Submit
                        </button>
                    </form>
                </div>

                <table id="result-table" style={{ width: "100%", maxWidth: "600px", margin: "0 auto 60px" }}>
                    <thead>
                        <tr>
                            <th>Login</th>
                            <th>Hit Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(usersWinRate).map(([login, value]) => (
                                <tr key={login}>
                                    <td>{login}</td>
                                    <td>{value}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <div id="welcome-link">
                    <a href="/login" className="redirect-link" onClick={processQuit}>
                        Quit
                    </a>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        position: "fixed",
                        bottom: "10px",
                        right: "30px",
                        width: "120px",
                        height: "45px",
                        borderRadius: "4px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        fontSize: "15px",
                        border: "none",
                        cursor: "pointer",
                        zIndex: 1000
                    }}
                >
                    Create admin
                </button>

                {isModalOpen && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 2000
                    }} onClick={() => setIsModalOpen(false)}>
                        <div
                            style={{
                                backgroundColor: "white",
                                padding: "30px",
                                borderRadius: "12px",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 style={{ marginTop: 0, textAlign: "center" }}>Create admin</h2>

                            {modalSuccess && <div style={{ marginBottom: "15px", textAlign: "center" }}>{modalSuccess}</div>}
                            {modalError && <div style={{ marginBottom: "15px", textAlign: "center" }}>{modalError}</div>}

                            <form onSubmit={handleCreateAdmin}>
                                <div style={{ marginBottom: "15px" }}>
                                    <label>Login</label>
                                    <input
                                        type="text"
                                        value={newAdminLogin}
                                        onChange={(e) => setNewAdminLogin(e.target.value)}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            marginTop: "5px",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={newAdminPassword}
                                        onChange={(e) => setNewAdminPassword(e.target.value)}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            marginTop: "5px",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>

                                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#6c757d",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Admin;