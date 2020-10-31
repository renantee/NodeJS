import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Post, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class PostService {
    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
    }

    create(post: Post) {
        return this.http.post(`${environment.apiUrl}/posts`, post);
    }

    getById(id: string) {
        return this.http.get<Post>(`${environment.apiUrl}/posts/${id}`);
    }

    getMyPosts() {
        return this.http.get<User>(`${environment.apiUrl}/users/my-posts`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/posts/${id}`, params)
            .pipe(map(x => {
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/posts/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }
}