import {ExtractJwt, Strategy} from 'passport-jwt';
import { PassportStatic } from 'passport';

export class Guard {
    private options = {
        secretOrKey: 'secret',
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }

    private service: any;

    constructor(service: any){
        this.service = service;
    }

    public guardForUser(passport: PassportStatic): any {
        passport.use(new Strategy(this.options, async (payload, done) => {
            //ko hieu lam nhung ma payload bh se la accessToken sau decode
            //console.log(payload);
            try {
                const user = await this.service.findOne(payload.sub);
    
                if(!user)
                    return done(null, false);
    
                //bay gio: req.user = user
                return done(null, user);
            }
            catch (err){
                return done(null, false);
            }
        }));
    }
}