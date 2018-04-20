import { Component, OnInit } from '@angular/core'
import { GLOBAL } from '../services/global'
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
    public alertMessage
    public url: string

    public constructor(
        private _userService: UserService
    ){
        this.titulo = 'Actualizar mis datos'
        // LocalStorage
        this.identity = this._userService.getIdentity()
        this.token = this._userService.getToken()

        this.user = this.identity
        this.url = GLOBAL.url
    }

    ngOnInit(){
        console.log('user-edit.component.ts cargado')
    }

    onSubmit(){
        this._userService.updateUser(this.user).subscribe(
            response => {
                if(!response.user){
                    this.alertMessage = 'El usuario no se ha actualizado!'
                }else{
                    //this.user = response.user
                    localStorage.setItem('identity', JSON.stringify(this.user))
                    document.getElementById("indentityName").innerHTML = this.user.name
                    if (!this.filesToUpload){
                        //redireccion
                    }else{
                        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload)
                            .then((result: any) => {
                                    this.user.image = result.image
                                    localStorage.setItem('identity', JSON.stringify(this.user))
                                    console.log(this.user)
                                }
                            )
                    }
                    this.alertMessage = 'Datos actualizados correctamente!'                    
                }
            },
            error => {
                let errorMessage = <any>error
                if(errorMessage){
                    var _body = JSON.parse(error._body)
                    this.alertMessage = _body.message
                    console.log(error)
                }
            }
        )  
    }

    public filesToUpload: Array<File>

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files
        //console.log(this.filesToUpload)
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        let token = this.token

        return new Promise((resolve, reject) => {
            let formData: any = new FormData()
            let xhr = new XMLHttpRequest

            for (var i = 0; i < files.length; i++){
                formData.append('image', files[i], files[i].name)
            }

            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                    resolve(JSON.parse(xhr.response))                        
                    }else{
                        reject(xhr.response)
                    }
                }
            }

            xhr.open('POST', url, true)
            xhr.setRequestHeader('Authorization', token)
            xhr.send(formData)
        })
    }
}