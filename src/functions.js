// returns a string like "1d 2h 30m 15s" if the time is exactly 3 hours still return "3h 0m 0s"
export const getReadableTimeSince = (date) => {
    let seconds = Math.floor((new Date() - date) / 1000);

    let days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    let hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    let mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;

    let readableTime = '';
    if (days > 0) readableTime += `${days}d `;
    if (hrs > 0 || days > 0) readableTime += `${hrs}h `;
    if (mnts > 0 || days > 0 || hrs > 0) readableTime += `${mnts}m `;
    if (seconds > 0 || days > 0 || hrs > 0 || mnts > 0) readableTime += `${seconds}s`;

    return readableTime;
}


export const parseDuration = (duration) => {
    // parses a duration string provided like "1d 2h 30m 15s" and returns the number of seconds it represents
    const durationParts = duration.split(' ');
    let seconds = 0;
    durationParts.forEach(part => {
        const num = parseInt(part);
        if (part.endsWith('d')) seconds += num * 24 * 60 * 60;
        else if (part.endsWith('h')) seconds += num * 60 * 60;
        else if (part.endsWith('m')) seconds += num * 60;
        else if (part.endsWith('s')) seconds += num;
    });
    return seconds;
}

