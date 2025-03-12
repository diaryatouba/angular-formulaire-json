import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import {CurrencyPipe, NgForOf} from "@angular/common"; // Importer Router pour la navigation
@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.component.html',
  imports: [
    NgForOf,
    CurrencyPipe
  ],
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit{

  constructor(private user: ApiService, private router: Router) {}  userData:any=[];
  ngOnInit(): void {
      this.user.getAlluser().subscribe((allData) => {
        console.log(allData);
        this.userData=allData;
      }
    );
  }
   loadUsers() {
    this.user.getAlluser().subscribe(
      (allData) => {
        console.log(allData);
        this.userData = allData;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  editUser(user: any) {
    this.router.navigate(['/edit-user', user.id]);
  }

  deleteUser(userId: number) {
    if (confirm("etes vous sur de vouloir supprimer ?")) {
      this.user.deleteUser(userId).subscribe(
        (response) => {
          console.log("User supprimer:", response);
          this.loadUsers();
        },
        (error) => {
          console.error("Error", error);
        }
      );
    }
  }

}
