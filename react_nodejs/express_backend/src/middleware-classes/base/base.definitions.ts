export interface DTrackerMiddleware {
    validateByIp: (ip: string) => boolean;
}