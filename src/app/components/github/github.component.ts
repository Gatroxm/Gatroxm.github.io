import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
