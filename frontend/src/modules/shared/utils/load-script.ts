export interface LoadScriptProps {
    url: string;
    id: string;
    callback?: () => void;
}

export const loadScript = (url: string, id: string, callback?: () => void) => {
    const existingScript = document.getElementById(id);

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = url;
        script.id = id;
        document.body.appendChild(script);
        script.onload = () => {
            if (callback) callback();
        };
    } else if (existingScript && callback) callback();
};
