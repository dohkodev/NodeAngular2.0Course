import { Component, OnInit } from '@angular/core';
import { GLOBAL } from './services/global'
import { UserService } from './services/user.service'
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  public title = 'MUSIFY'
  public user: User
  public userRegister: User
  public identity
  public token
  public errorMessage
  public alertRegister
  public url: string

  constructor(
    private _userService: UserService
  ){
    this.user = new User('','','','','','ROLE_USER', '')
    this.userRegister = new User('','','','','','ROLE_USER', '')
    this.url = GLOBAL.url
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken()
    
    console.log(this.identity)
    console.log(this.token)
  }

  public onSubmit(){
    console.log(this.user)

    //conseguir datos de usuario identificado
    this._userService.singup(this.user).subscribe(
      response => {
        let identity = response.user
        this.identity = identity
        if(!this.identity._id){
          alert('Usuario no esta correctamente identificado')
        }else{
          //crear elemento en el localStorage para tener al usuario en sesion
          localStorage.setItem('identity', JSON.stringify(identity))
          //conseguir token para enviarlo a cada peticion hhtp
          this._userService.singup(this.user, true).subscribe(
            response => {
              let token = response.token
              this.token = token
              if(this.token.length <= 0){
                alert('el token no se ha generado')
              }else{
                //crear elemento en el localStorage para tener el token disponible
                localStorage.setItem('token', token)
                this.user = new User('','','','','','ROLE_USER', '')   
              }
            },
            error => {
              let errorMessage = <any>error
              if(errorMessage){
                var _body = JSON.parse(error._body)
                this.errorMessage = _body.message
                console.log(error)
              }
            }
          )
        }
      },
      error => {
        let errorMessage = <any>error
        if(errorMessage){
          var _body = JSON.parse(error._body)
          this.errorMessage = _body.message
          console.log(error)
        }
      }
    )
  }

  public logout(){
    localStorage.removeItem('identity')
    localStorage.removeItem('token')
    localStorage.clear()
    this.identity = null
    this.token = null
  }

  public onSubmitRegister(){
    console.log(this.userRegister)

    this._userService.register(this.userRegister).subscribe(
      response => {
        let user = response.user
        this.userRegister = user

        if (!user._id){
          this.alertRegister = 'Error al registrarse'
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con '+this.userRegister.email
          this.userRegister = new User('','','','','','ROLE_USER', '');
        }
      },
      error => {
        let errorMessage = <any>error
          if(errorMessage){
            var _body = JSON.parse(error._body)
            this.alertRegister = _body.message
            console.log(error)
          }
      }
    )
  }

}
