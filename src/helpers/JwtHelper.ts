export { Request } from "express";
export jwt from "jsonwebtoken";
export class JwtHelper {
    static getUserId(req: Request){
        const token = (req.headers as any).authorization?.split(" ")[1];
        if(!token) return null;
        const decodedToken = JwtHelper.decode(token,{json: true});
        return decodedToken?.sub;
    };
}