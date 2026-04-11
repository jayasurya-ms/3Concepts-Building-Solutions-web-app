/**
 * Generates and persists a unique device ID for the browser/session.
 * @returns {string} The persistent device ID.
 */
export const getDeviceId = () => {
    let deviceId = localStorage.getItem('device_id');
    
    if (!deviceId) {
        // Use crypto.randomUUID if available, otherwise fallback to a random string sequence
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            deviceId = crypto.randomUUID();
        } else {
            deviceId = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15) + 
                       Date.now().toString(36);
        }
        localStorage.setItem('device_id', deviceId);
    }
    
    return deviceId;
};
