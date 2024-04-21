export function formatTime(date: Date) {
    return `${date.getHours().toString().padStart(2, '0')}:` + 
    `${date.getMinutes().toString().padStart(2, '0')}:` + 
    `${date.getSeconds().toString().padStart(2, '0')}`;
}