import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent implements OnInit {
  articles: any[] = [];
  newArticle = { 
    title: '', 
    content: '', 
    category: 'Actualités' 
  };

  // Liste des catégories disponibles
  categories = ['Actualités', 'Sport', 'Divertissement', 'Technologie', 'Santé'];

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe(data => {
      this.articles = data;
    });
  }

  addArticle(): void {
    if (this.newArticle.title && this.newArticle.content) {
      this.articleService.addArticle(this.newArticle).subscribe(() => {
        this.loadArticles();
        this.newArticle = { title: '', content: '', category: 'Actualités' };
      });
    }
  }

  deleteArticle(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.articleService.deleteArticle(id).subscribe(() => {
        this.loadArticles();
      });
    }
  }

  // Méthode pour obtenir la classe CSS selon la catégorie
  getCategoryClass(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Actualités': 'category-actualites',
      'Sport': 'category-sport',
      'Divertissement': 'category-divertissement',
      'Technologie': 'category-technologie',
      'Santé': 'category-sante'
    };
    return categoryMap[category] || 'category-actualites';
  }
}