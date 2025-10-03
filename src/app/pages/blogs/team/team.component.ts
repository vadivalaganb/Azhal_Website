import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-team',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent implements OnInit{
 teamMembers: any[] = [];

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTeamMembers();
  }

  loadTeamMembers() {
    this.apiService.getTeamMembers().subscribe({
      next: (res) => {
        this.teamMembers = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
