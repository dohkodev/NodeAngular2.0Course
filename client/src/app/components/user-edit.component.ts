import { Component, OnInit } from '@angular/core'
import { UserService } from '../services/user.service'
import { User } from '../models/user'

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {

    public titulo: String
    public user: User
    public identity
    public token

    public constructor(
        private _userService: UserService
    ){
        this.titulo = 'Actualizar mis datos'
    }

    ngOnInit(){
        this.identity = this._userService.getIdentity()
        this.token = this._userService.getToken()
        console.log('user-edit.component.ts cargado')
    }
}