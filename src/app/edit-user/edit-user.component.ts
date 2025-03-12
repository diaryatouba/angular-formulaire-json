import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { DynamicFormComponent, IForm, IFormControl } from '../dynamic-form/dynamic-form.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
@Component({
  selector: 'app-edit-user',
  standalone: true,
  templateUrl: './edit-user.component.html',
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit{
  userId: number | null = null;
  user: any = {};
  dynamicForm!: FormGroup;
    formJson: IFormControl[] = [];
    form!: IForm;
    selectedUserId: number | null = null; // Pour stocker l'ID de l'utilisateur sélectionné
    @ViewChild('myForm') myForm!: NgForm; // Référence au formulaire
  router: any;

    constructor(private route: ActivatedRoute , private fb: FormBuilder, private http: HttpClient, private apiService: ApiService, ) {}

  editUser = new FormGroup({
    prenom: new FormControl(''),
    nom: new FormControl(''),
    mobile: new FormControl(''),
  })


  saveUser() {
    if (this.userId) {
      this.apiService.updateUser(this.userId, this.user).subscribe(response => {
        console.log("Utilisateur mis à jour :", response);
      });
    }
  }
  ngOnInit(): void{
    console.log(this.router.snapshot.params['userId']);
    this.user.getUserById(this.router.snapshot.params).subscribe((result: any) =>{
      console.log(result);
    }  );

  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      console.log(this.dynamicForm.value);
      this.saveUser();
    } else {
      console.error('Form is invalid');
    }
  }
  // UpdateData(){
  //   this.user.saveUser(this.onSubmit.value).subscribe((result) =>{
  //     this.message=true;
  //     this.onSubmit.reset({}),
  //   });
  // }
  // getValidationErrors(control: IFormControl): string {
  //   const myFormControl = this.dynamicForm.get(control.name);
  //   let errorMessage = '';
  //   if (myFormControl && control.validators) {
  //     control.validators.forEach((val) => {
  //       if (myFormControl.hasError(val.validatorName as string)) {
  //         errorMessage = val.message as string;
  //       }
  //     });
  //   }
  //   return errorMessage;
  // }
}
