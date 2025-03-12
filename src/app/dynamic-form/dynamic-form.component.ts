import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Form, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";

export interface IForm {
  formTitle: string
  formControls: IFormControl[]
  saveBtnTitle?: string
  resetBtnTitle?: string
  countries?: string
  countryRegions?: { [key: string]: IOptions[] };
}
export interface IFormControl {
  name: string
  label: string
  value? : string
  options?: IOptions[]
  radioOptions?: string[]
  placeHolder?: string
  class: string
  type: string
  validators: IValidator[]
}
export interface IValidator {
  validatorName?: string
  message?: string
  required?: boolean
  pattern?: string
  minLength?: number
  maxLength?: number
  email?: string
}

interface IOptions {
  id?: number,
  value?: string
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  templateUrl: './dynamic-form.component.html',
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit{
  dynamicForm!: FormGroup;
  formJson: IFormControl[] = [];
  form: IForm = { formTitle: '', formControls: [], saveBtnTitle: 'Save', resetBtnTitle: 'Reset' };
  userList: any[] = []; // Pour stocker la liste des utilisateurs
  selectedUserId: number | null = null; // Pour stocker l'ID de l'utilisateur sélectionné
  @ViewChild('myForm') myForm!: NgForm; // Référence au formulaire
  constructor(private fb: FormBuilder, private readonly http: HttpClient, private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({});
    this.loadFormData();
    this.getAllUsers();
    this.loadFormData();
  }

  loadFormData() {
    this.http.get('assets/data.json').subscribe(
      (data: any) => {
        this.form = data;
        this.buildForm();
        //this.getRegion();
      },
      (error) => {
        console.error('Erreur lors du chargement:', error);
      }
    );
  }

  buildForm(): void {
    if (this.form?.formControls) {
      const formGroup: any = {};
      this.form.formControls.forEach((control: IFormControl) => {
        const controlValidators: any = [];
        if (control.validators) {
          control.validators.forEach((val: any) => {
            if (val.validatorName === 'required') controlValidators.push(Validators.required);
            if (val.validatorName === 'email') controlValidators.push(Validators.email);
            if (val.validatorName === 'minlength') controlValidators.push(Validators.minLength(val.minLength));
            if (val.validatorName === 'pattern') controlValidators.push(Validators.pattern(val.pattern));
            if (val.validatorName === 'maxlength') controlValidators.push(Validators.maxLength(val.maxLength));
          });
        }
        formGroup[control.name] = [control.value || '', controlValidators];
      });
      this.dynamicForm = this.fb.group(formGroup);
    }
  }
 /* getRegion(): void {
    const countryControl = this.dynamicForm.get('country');
    const regionControl = this.dynamicForm.get('region');

    if (countryControl && regionControl) {
      countryControl.valueChanges.subscribe((countryCode: string) => {
        // Réinitialiser la région lorsque le pays change
        regionControl.setValue('');

        // Mettre à jour les options de la région en fonction du pays sélectionné
        const regions = this.form.countryRegions?.[countryCode] || [];
        const regionFormControl = this.form.formControls.find((c) => c.name === 'region');
        if (regionFormControl) {
          regionFormControl.options = regions;
        }
      });
    }
  }*/


  onSubmit() {
    if (this.dynamicForm.valid) {
      console.log(this.dynamicForm.value);
      this.saveUser();
    } else {
      console.error('Le form n est pas valide');
    }
  }

  resetForm(): void {
    this.dynamicForm.reset();
  }

  getValidationErrors(control: IFormControl): string {
    const myFormControl = this.dynamicForm.get(control.name);
    let errorMessage = '';
    if (myFormControl && control.validators) {
      control.validators.forEach((val) => {
        if (myFormControl.hasError(val.validatorName as string)) {
          errorMessage = val.message as string;
        }
      });
    }
    return errorMessage;
  }

  getAllUsers() {
    this.apiService.getAlluser().subscribe(
      (response) => {
        console.log("Liste des users:", response);
      },
      (error) => {
        console.error("Erreur en recuperant users:", error);
      }
    );
  }

  saveUser() {
    if (this.dynamicForm.valid) {
      this.apiService.createUser(this.dynamicForm.value).subscribe(
        (response) => {
          alert("User a ete bien ajouté!");
          console.log("Les donnees de l'utilisateur ont ete bien ajouté:", response);
          this.getAllUsers();
        },
        (error) => {
          console.error("Error en sauvegardant les donnees de l'utilisateur:", error);
        }
      );
    }
  }

  updateUser(userId: number, userData: any) {
    this.apiService.updateUser(userId, userData).subscribe(
      (response) => {
        alert("User a ete bien modifie!");
        console.log("Les donnees de l'utilisateur ont bien ete modifie:", response);
        this.getAllUsers(); // Rafraîchir la liste des utilisateurs
        this.resetForm(); // Réinitialiser le formulaire
      },
      (error) => {
        console.error("Error lors de la modification des donnees :", error);
      }
    );
  }

  deleteUser(userId: number) {
    if (confirm("Est tu sur de bien vouloir supprimé cet utilisateur?")) {
      this.apiService.deleteUser(userId).subscribe(
        (response) => {
          alert("L'utilisateur a bien ete supprimer!");
          console.log("User supprimé:", response);
          this.getAllUsers(); // Rafraîchir la liste des utilisateurs
        },
        (error) => {
          console.error("erreur en supprimant le user:", error);
        }
      );
    }
  }

  editUser(user: any) {
    this.selectedUserId = user.id; // Stocker l'ID de l'utilisateur sélectionné
    this.dynamicForm.patchValue(user); // Remplir le formulaire avec les données de l'utilisateur
  }
}
