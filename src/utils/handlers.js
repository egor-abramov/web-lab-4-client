import { scale, drawPoint, getCtx, getCanvas } from './canvas.js';
import { apiFetch } from './api.js';

export async function handleSubmit(x, y, r, accessToken) {
    const ctx = getCtx();
    if (!ctx) return;
    const errorMessage = document.getElementById("error-message");
        
    if(isNaN(y) || y === "") {
        errorMessage.innerText = "Y must be a number";
        throw new Error();
    } else if (y > 3 || y < -5) {
        errorMessage.innerHTML = "Y must be between -5 and 3";
        throw new Error();
    } 
    return await sendPoint({x: x, y: y, r: r}, accessToken);
}

export async function handleClear(accessToken) {
    const result = await apiFetch("/points/clear", 'DELETE', accessToken);
    console.log(result);
    if (result) {
        return true;
    }
    return false;
}

export async function handleQuit(accessToken) {
    const result = await apiFetch("/auth/logout", 'POST', accessToken);
    if (result) {
        return true;
    }
    return false;
}

export async function handleGraphClick(event, r, accessToken) {
    const canvas = getCanvas();
    const ctx = getCtx();
    if (!ctx) return;
    
    if(r === 0) {
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = event.clientX;
    const clientY = event.clientY;

    if (!clientX || !clientY) return;

    const rScale = scale * (r / 2.8);

    const x = ((clientX - rect.left) * scaleX - centerX) / rScale * r;
    const y = -((clientY - rect.top) * scaleY - centerY) / rScale * r;

    return await sendPoint({x: x, y: y, r: r}, accessToken);
}

async function sendPoint(point, accessToken) {
    const errorMessage = document.getElementById("error-message");
    
    const options = {
        body: point,
        headers: {}
    }

    const result = await apiFetch("/points/process", 'POST', accessToken, options);
    if (result) {
        errorMessage.innerText = "";
        return await result.json();
    }
    return null;
}
