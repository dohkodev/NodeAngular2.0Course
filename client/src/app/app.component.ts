import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.services'
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit{
  public title = 'MUSIFY';
  public user: User;
  public identity;
  public token;
  public errorMessage

  constructor(
    private _userService: UserService
  ){
    this.user = new User('','','','','','ROLE_USER', '');
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
                console.log(token)
                console.log(identity)      
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

}
