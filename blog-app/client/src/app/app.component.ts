import { Component } from '@angular/core';

import { AccountService } from './_services';
import { PostService } from './_services';
import { Post } from './_models';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    post: Post;
    user: User;

    constructor(
        private accountService: AccountService,
        private postService: PostService
    ) {
        this.accountService.user.subscribe(x => this.user = x);
        this.postService.post.subscribe(x => this.post = x);
    }

    logout() {
        this.accountService.logout();
    }
}