import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {User} from '../models/user';

@Component({
	selector:'user-edit',
	templateUrl:'../views/user-edit.html',
	providers:[UserService]
})

export class UserEditComponent implements OnInit {
	public titulo:string;
	public user:User;
	public identity;
	public token;

	constructor(private _userService:UserService){
		this.titulo= 'Actualizar mis datos';
		this.user= new User('','','','','','ROLE_USER','');

		//Loca Storage para la persistencia de datos
		this.identity= this._userService.getIdentity();
 		this.token=this._userService.getToken();
	}

	ngOnInit(){
		console.log('User-edit cargado correctamente');
	}

	onSubmit(){
		console.log(this.user);
	}
}