//function to get readyState text
function getReadyStateText(state) {
    switch (state) {
        case 0: return 'Disconnected';
        case 1: return 'Connected';
        case 2: return 'Connecting';
        case 3: return 'Disconnecting';
            
        default: return 'Unknown';
    }

}