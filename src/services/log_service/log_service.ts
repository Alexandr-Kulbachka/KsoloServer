class LogService {

    static printLog(message: any) {
        console.log(`
${new Date()} ${message}
        `);
    }
}

export default LogService;