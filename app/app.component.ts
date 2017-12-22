import { Component, OnInit } from '@angular/core';
import {User} from './models/user'
import {UserService} from './services/user.service'
import { GLOBAL } from './services/global';
@Component({
 	selector: 'app-root',
  	templateUrl: './app.component.html',
  	providers: [UserService]
})
export class AppComponent implements OnInit{
 	public title = 'Title';
 	public user: User;
 	public user_register: User;
 	public identity; //Objeto con el usuario identificado
 	public token;
 	public errorMessage;
 	public alertRegister;
 	public url:string

 	constructor(
 		private _userService:UserService
 		){
 		this.user= new User('','','','','','ROLE_USER','');
 		this.user_register= new User('','','','','','ROLE_USER','');
 		this.url=GLOBAL.url;
 	}	

 	ngOnInit(){
 		this.identity= this._userService.getIdentity();
 		this.token=this._userService.getToken();

 		console.log(this.identity);
 		console.log(this.token);
 	}

 	public onSubmit(){
 		console.log(this.user);
 		//Obtener los datos del usuario identificado
 		this._userService.signUp(this.user).subscribe(
 			response=>{
 				console.log(response);
 				let usuarioObtenido= response.user;
 				this.identity= usuarioObtenido;

 				if(!this.identity._id){
 					alert('El usuario no esta correctamete loggeado');
 				}else{
 					//Guardar sesion el en local storage para tener al user en sesión
 					localStorage.setItem('identity',JSON.stringify(this.identity));

 					//Obtener el token para las peticiones http

			 		this._userService.signUp(this.user, true).subscribe(
			 			response=>{
			 				console.log(response);
			 				let tokenObtenido= response.token;
			 				this.token= tokenObtenido;

			 				if(this.token.length<=0){
			 					alert('El token no se ha generado');
			 				}else{
			 					//Crear token en el local storge
			 					localStorage.setItem('token',this.token);
			 					this.user= new User('','','','','','ROLE_USER','');
			 				}
			 			},
			 			error=>{
			 				var errorMessage= <any>error;
			 				if(errorMessage!=null){
			 					var body = JSON.parse(error._body);
			 					this.errorMessage=body.message;
			 					console.log(error);
			 				}
			 			}
			 		);
 				}
 			},
 			error=>{
 				var errorMessage= <any>error;
 				if(errorMessage!=null){
 					var body = JSON.parse(error._body);
 					this.errorMessage=body.message;
 					console.log(error);
 				}
 			}
 		);
 	}

	logout(){
		localStorage.removeItem('identity');
		localStorage.removeItem('token');
		localStorage.clear();
		this.identity=null;
		this.token=null;
		this.errorMessage="";
		this.alertRegister="";
	}

	onSubmitRegister(){
		console.log(this.user_register);

		this._userService.register(this.user_register).subscribe(
			response=>{
				let user= response.user;
				this.user_register=user;
				if(!user._id){
					this.alertRegister=('Error al registrarse');
				}else{
					this.alertRegister=('El registro se ha realizado correctamente, identificate con'+this.user_register.email);
					this.user_register= new User('','','','','','ROLE_USER','');
				}
			},
			error=>{
				var errorMessage= <any>error;
 				if(errorMessage!=null){
 					var body = JSON.parse(error._body);
 					this.alertRegister=body.message;
 					console.log(error);
 				}
			}
		)
	}
}
