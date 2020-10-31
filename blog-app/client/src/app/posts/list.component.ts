import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { PostService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    posts = null;
    my = '';

    constructor(
        private postService: PostService,
        private router: Router
    ) {}

    ngOnInit() {
        if (this.router.url == '/my-posts') {
            this.my = 'My ';

            this.postService.getMyPosts()
                .pipe(first())
                .subscribe(posts => this.posts = posts);
        } else {
            this.my = 'All ';

            this.postService.getAll()
                .pipe(first())
                .subscribe(posts => this.posts = posts);
        }
    }

    deletePost(id: string) {
        const post = this.posts.find(x => x.id === id);
        post.isDeleting = true;
        this.postService.delete(id)
            .pipe(first())
            .subscribe(() => this.posts = this.posts.filter(x => x.id !== id));
    }
}