class AppError extends Error{
    constructor(message,satusCode){
        super(message)
        this.satusCode=satusCode;
        Error.captureStackTrace(this,this.constructor);
    }
}
export default AppError;