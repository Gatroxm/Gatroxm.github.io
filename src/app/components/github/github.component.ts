import { Component, OnInit, inject } from '@angular/core';
import { cp } from 'fs';
import { NgFor, NgIf } from '@angular/common';
import { GithubService } from '../../services/github.service';
import CardComponent from '../shared/card/card.component';

@Component({
  selector: 'app-github',
  standalone: true,
  imports: [NgIf, NgFor, CardComponent],
  templateUrl: './github.component.html',
  styleUrl: './github.component.scss',
})
export default class GithubComponent implements OnInit {
  repos: any[] = [];

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.githubService.getRepos().subscribe(
      (data) => {
        this.repos = data;
      },
      (error) => console.error('Error fetching the repos:', error)
    );
  }
}
