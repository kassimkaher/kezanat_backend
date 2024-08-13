


import AuthService from '../../services/AuthService';


const authService = new AuthService();

class AuthController {

    public constructor() {
        authService.createAdmin();
    }



    public async createUser(req: any, response: any) {

 
            return authService.create(req, response);
       


    }
    public async updateUser(req: any, response: any) {

        return authService.update(req, response);
    }

    public async verifyUser(req: any, response: any) {

      return authService.verifyUser(req, response);
    }

    public async reSendCode(req: any, response: any) {

        return authService.reSendCode(req, response);
    }

    public async login(req: any, response: any) {
        return authService.login(req, response);
    }

    public async profile(req: any, response: any) {
        return authService.profile(req, response);
    }


    public async getUsers(req: any, response: any) {
        return authService.getUsers(req, response);
    }

}

export default AuthController;
