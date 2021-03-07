export const convertDurationMs = (duration: number) => {
    const seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return `${formatDuration(hours, Durations.hours)}${formatDuration(
        minutes,
        Durations.minutes
    )}${formatDuration(seconds, Durations.seconds)}`;
};

export enum Durations {
    hours,
    minutes,
    seconds,
}

export const formatDuration = (duration: number, type: Durations) => {
    let durationStr = duration.toString();

    if (type === Durations.hours) {
        if (!duration) {
            return '';
        }
    }

    if (type === Durations.seconds) {
        durationStr = duration < 10 ? `0${duration}` : durationStr;
    }

    return `${durationStr}${type !== Durations.seconds ? ':' : ''}`;
};
