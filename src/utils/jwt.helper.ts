import jwt from 'jsonwebtoken';
import { jwt_secret } from '../config/config';


function decodeToken(token: string) {
    return jwt.decode(token.replace('Bearer ', ''));
}

// async function getAuthUser(token: string) {
//     try {
//         const tokenData = decodeToken(token);
//         const user = await User.findById(tokenData.id);
//         return user;
//     } catch (e) {
//         return null;
//     }
// }


function getJWTToken(data: any) {
    const token = `Bearer ${jwt.sign(data, jwt_secret)}`;
    return token;
}

export { decodeToken, getJWTToken,  };
