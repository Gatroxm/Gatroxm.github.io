import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-github',
  standalone: true,
  imports: [],
  templateUrl: './github.component.html',
  styleUrl: './github.component.scss',
})
export class GithubComponent implements OnInit {
  repos: any[] = [];

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.githubService.getRepos().subscribe(
      (data) => (this.repos = data),
      (error) => console.error('Error fetching the repos:', error)
    );
  }
}
