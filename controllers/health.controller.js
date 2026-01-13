import { getDBStatus } from "../database/db.js";

export const checkHealth = async (req, res) => {
    try {
        const dbStatus = getDBStatus(); 
    
        const healthStatus = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    status: dbStatus.isConnected ? 'Healthy' : 'Unhealthy',
                    details: {
                        ...dbStatus,
                        readyState: getReadyStateText(dbStatus.readyState)
                    }
                },
                server: {
                    status: 'Healthy',
                    uptime: process.uptime(),
                    memoryUsage: process.memoryUsage
                }
            }
        }
    
        const httpStatus = healthStatus.services.database.status === 'Healthy' ? 200 : 503;
    
        res.status(httpStatus).json(healthStatus);
    } catch (error) {
        console.error('Health check failed', error);
        res.status(500).json({
            status: "ERROR",
            timestamp: new Date().toISOString(),
            error: error.message
        })
    }
}

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