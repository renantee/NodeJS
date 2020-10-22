import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { PostService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    posts = null;

    constructor(private postService: PostService) {}

    ngOnInit() {
        this.postService.getAll()
            .pipe(first())
            .subscribe(posts => this.posts = posts);
    }

    deletePost(id: string) {
        const post = this.posts.find(x => x.id === id);
        post.isDeleting = true;
        this.postService.delete(id)
            .pipe(first())
            .subscribe(() => this.posts = this.posts.filter(x => x.id !== id));
    }
}