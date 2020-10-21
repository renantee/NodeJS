import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Post } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class PostService {
    private postSubject: BehaviorSubject<Post>;
    public post: Observable<Post>;

    constructor(
        private http: HttpClient
    ) {
        this.postSubject = new BehaviorSubject<Post>(JSON.parse(localStorage.getItem('post')));
        this.post = this.postSubject.asObservable();
    }

    public get postValue(): Post {
        return this.postSubject.value;
    }

    getAll() {
        return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
    }

    create(post: Post) {
        return this.http.post(`${environment.apiUrl}/posts`, post);
    }

    getById(id: string) {
        return this.http.get<Post>(`${environment.apiUrl}/posts/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/posts/${id}`, params)
            .pipe(map(x => {
                // update stored post if the logged in post updated their own record
                if (id == this.postValue.id) {
                    // update local storage
                    const post = { ...this.postValue, ...params };
                    localStorage.setItem('post', JSON.stringify(post));

                    // publish updated post to subscribers
                    this.postSubject.next(post);
                }
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