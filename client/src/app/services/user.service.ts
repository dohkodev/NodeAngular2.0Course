import { Injectable } from '@angular/core'
import { Http, Response, Headers } from '@angular/http'
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable'
import { GLOBAL } from './global'

@Injectable()
export class UserService {
    
    public identity
    public token
    public url: String

    constructor(private _http: Http){
        this.url = GLOBAL.url
    }

    public singup(user_to_login, gethash = null){
        if(gethash){
            user_to_login.gethash = gethash
        }
        let json = JSON.stringify(user_to_login)
        let params = json
        let headers = new Headers({'Content-Type':'application/json'})

        return this._http.post(this.url+'login', params, {headers: headers})
            .map(res => res.json())
    }

    public register(userToRegister){
        let params = JSON.stringify(userToRegister)
        let headers = new Headers({'Content-Type':'application/json'})

        return this._http.post(this.url+'register', params, {headers: headers})
            .map(res => res.json())
    }

    public updateUser(userToUpdate){
        let params = JSON.stringify(userToUpdate)
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': this.getToken()
        })

        return this._http.put(this.url+'user/'+userToUpdate._id, params, {headers: headers})
            .map(res => res.json())
    }

    public getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'))
        if(identity != 'undefined'){
            this.identity = identity
        }else{
            this.identity = null
        }

        return this.identity
    }

    public getToken(){
        let token = localStorage.getItem('token')
        if(token != 'undefined'){
            this.token = token
        }else{
            this.token = null
        }
        return this.token 
    }
}

