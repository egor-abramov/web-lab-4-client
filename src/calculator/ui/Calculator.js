import React, { useEffect } from "react";
import './calculator.css'

import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';

import { createGraph, drawPoint, initCanvas } from '../../utils/canvas.js';
import { handleClear, handleSubmit, handleGraphClick, handleQuit } from '../../utils/handlers.js';

import { setR, setX, addPoint, clearPoints, setPoints } from '../model/calculatorSlice.js';
import { apiFetch } from '../../utils/api.js'
import { convertUTCToLocal } from '../../utils/calculator.js';
import { getCtx } from "../../utils/canvas.js";
import { logout } from "../../auth/model/authSlice.js";

function Calculator() {
    const dispatch = useDispatch();
    const x = useSelector(s => s.calculator.x);
    const r = useSelector(s => s.calculator.r);
    const points = useSelector(s => s.calculator.points);
    const accessToken = useSelector(s => s.auth.accessToken);

    const rOptions = ['1', '2', '3', '4', '5'];
    const xOptions = ['-3', '-2', '-1', '0', '1', '2', '3', '4', '5'];

    useEffect(() => {
        async function loadPoints() {
           try {
                if (!accessToken) return;
                const result = await apiFetch('/points', 'GET', accessToken);
                if (result) {
                    const savedPoints = await result.json();
                    console.log(savedPoints);
                    dispatch(setPoints(savedPoints));
                } else {
                    window.location = "/login";
                }
           } catch (err) {
                window.location = "/login"
           }
        }

        loadPoints();
    }, [accessToken]);

    useEffect(() => {
        if (!getCtx()) return;

        createGraph(r); 

        points.forEach(point => {
            drawPoint(point, r);
        });
    }, [points, r]);

    useEffect(() => {
        initCanvas();
        if(!accessToken){
            window.location = '/login';
        }
    }, []);

    async function processSubmit() {
        const y = document.getElementById("y-value").value;
        try {
            const point = await handleSubmit(x, y, r, accessToken);
            if(point != null) {
                dispatch(addPoint(point)); 
                drawPoint(point, r);
            } else {
                window.location = '/login';
                return null;
            }
            return point;
        } catch(err) {
            console.log("Error: " + err);
        }
    };

    async function processClear() {
        const result = await handleClear(accessToken);
        if(result) {
            dispatch(clearPoints());
            createGraph(r);
        } else {
            window.location = '/login'
        }
    }

    async function processClick(e) {
        try {
            const point = await handleGraphClick(e, r, accessToken);
            if(point != null) {
                dispatch(addPoint(point)); 
                drawPoint(point, r);
            } else {
                // window.location = '/login';
                return null;
            }
            return point;
        } catch(err) {
            console.log("Error: " + err);
        }
    }

    async function processQuit() {
        const result = await handleQuit(accessToken);
        if(result) {
            alert("LOGOUT NOW");
            dispatch(logout());
        }
    }

    return (
        <main>
            <div className="container">
                <section id="input-section">
                    <form id="input-form" className="input-form">
                        <div className="form-group">
                            <label for="x-input-group">Choose X</label>
                            <Autocomplete
                                onChange={(e, value) => dispatch(setX(value || ''))} 
                                options={xOptions}
                                value={x}
                                disableClearable
                                renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    className="autoComplete"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: null,
                                    }}
                                /> 
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <label for="y-input-group">Enter Y</label>
                            <div id="y-input-group">
                                <input type="text" id="y-value" className="enter-y" 
                                    required></input>
                            </div>
                        </div>

                        <div className="form-group">
                            <label for="r-input-group">Choose R</label>
                            <Autocomplete
                                onChange={(e, value) => dispatch(setR(value || ''))} 
                                options={rOptions}
                                value={r}
                                disableClearable
                                renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    className="autoComplete"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: null,
                                    }}
                                /> 
                                )}
                            />
                        </div>

                        <button type="button" id="submit-button" onClick={processSubmit}>Submit</button>
                        <button type="button" id="clear-button" onClick={processClear}>Clear</button>
                    </form>

                    <div id="error-message"></div>
                </section>

                <section id="result">
                    <table id="result-table">
                        <thead>
                            <tr>
                                <th>X</th>
                                <th>Y</th>
                                <th>R</th>
                                <th>Time</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {points.map((point, index) => (
                                <tr key={index}>
                                    <td>{Math.round(point.x * 1000) / 1000}</td>
                                    <td>{Math.round(point.y * 1000) / 1000}</td>
                                    <td>{point.r}</td>
                                    <td>{convertUTCToLocal(point.time)}</td>
                                    <td>{point.hit ? 'Hit' : 'Miss'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section id="graph-section" onClick={(e) => processClick(e)}>
                    <canvas id="graph" width="500" height="500"></canvas>
                </section>

                <div id="welcome-link">
                    <a href="login" className="redirect-link" onClick={processQuit}>Quit</a>
                </div>
            </div>
        </main>
    );
}

export default Calculator;