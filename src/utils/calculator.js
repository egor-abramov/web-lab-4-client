export function convertUTCToLocal(utcTime) {
    try{
        const now = new Date();
        const [hours, minutes, seconds] = utcTime.split("T")[1].split(".")[0].split(':').map(Number);
        const utcDate = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            hours,
            minutes,
            seconds
        ));

        const localDate = new Date(utcDate);
        const formatTime = (num) => num.toString().padStart(2, '0');
        const localHours = formatTime(localDate.getHours());
        const localMinutes = formatTime(localDate.getMinutes());
        const localSeconds = formatTime(localDate.getSeconds());

        return `${localHours}:${localMinutes}:${localSeconds}`;
    }catch (err) {
        console.log("Error while converting time: " + err);
        return utcTime;
    }
}