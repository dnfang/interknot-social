import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  constructor(private http: HttpClient) { }

  getUsers() {
    let users = new Subject<any>();
    this.http.get('http://localhost:8080/users', {observe: 'response'}).subscribe((res: any) => {
      if (res.status === 200) {
        if (res.body.hasOwnProperty("_embedded")) {
          users.next(res.body['_embedded']['userAccountList']);
          return
        }
        users.next([]);
      }
    });
    return users.asObservable();
  }

  getUserDetails(username: string) {
    let user = new Subject<Object>();
    this.getUsers().subscribe(users => {
      let userObj = users.find((u: { username: string; }) => u.username === username);
      user.next(userObj);
    })

    return user.asObservable();
  }

  addUser(userBody: Object) {
    let body = new Subject<any>();
    this.http.post('http://localhost:8080/users', userBody).subscribe((res: any) => {
      body.next(userBody);
    });
    return body.asObservable();
  }

  updateUser(userBody: Object, id: number) {
    this.http.put('http://localhost:8080/users/' + id, userBody, {observe: 'response'}).subscribe((res: any) => {

    })
  }


  getPosts() {
    let posts = new Subject<any>();
    this.http.get('http://localhost:8080/posts', {observe: 'response'}).subscribe((res: any) => {
      if (res.status === 200) {
        if (res.body.hasOwnProperty("_embedded")) {
          posts.next(res.body['_embedded']['postList']);
          return
        }
        posts.next([]);
      }
    });
    return posts.asObservable();
  }

  getPostDetails(id: number) {
    let post = new Subject<Object>();
    this.getPosts().subscribe(posts => {
      let postObj = posts.find((p: { id: number; }) => p.id === id);
      post.next(postObj);
    })

    return post.asObservable();
  }

  addPost(postBody: Object) {
    let body = new Subject<any>();
    this.http.post('http://localhost:8080/posts', postBody).subscribe((res: any) => {
      body.next(postBody);
    });
    return body.asObservable();
  }

  updatePost(postBody: Object, id: number) {
    this.http.put('http://localhost:8080/posts/' + id, postBody, {observe: 'response'}).subscribe((res: any) => {
    })
  }

  deletePost(id: number) {
    this.http.delete('http://localhost:8080/posts/' + id, {observe: 'response'}).subscribe((res: any) => {

    })
  }
















  getComments() {
    let comments = new Subject<any>();
    this.http.get('http://localhost:8080/comments', {observe: 'response'}).subscribe((res: any) => {
      if (res.status === 200) {
        if (res.body.hasOwnProperty("_embedded")) {
          comments.next(res.body['_embedded']['commentList']);
          return
        }
        comments.next([]);
      }
    });
    return comments.asObservable();
  }

  getCommentDetails(id: number) {
    let comment = new Subject<Object>();
    this.getComments().subscribe(comments => {
      let commentObj = comments.find((c: { commentId: number; }) => c.commentId === id);
      comment.next(commentObj);
    })

    return comment.asObservable();
  }

  addComment(commentBody: Object) {
    let body = new Subject<any>();
    this.http.post('http://localhost:8080/comments', commentBody).subscribe((res: any) => {
      body.next(commentBody);
    });
    return body.asObservable();
  }

  updateComment(commentBody: Object, id: number) {
    this.http.put('http://localhost:8080/comments/' + id, commentBody, {observe: 'response'}).subscribe((res: any) => {
    })
  }

  deleteComment(id: number) {
    this.http.delete('http://localhost:8080/comments/' + id, {observe: 'response'}).subscribe((res: any) => {

    })
  }





  getLikes() {
    let likes = new Subject<any>();
    this.http.get('http://localhost:8080/likes', {observe: 'response'}).subscribe((res: any) => {
      if (res.status === 200) {
        if (res.body.hasOwnProperty("_embedded")) {
          likes.next(res.body['_embedded']['likeObjectList']);
          return
        }
        likes.next([]);
      }
    });
    return likes.asObservable();
  }

  getLikeDetails(username: string) {
    let like = new Subject<Object>();
    this.getLikes().subscribe(likes => {
      let likeObj = likes.find((l: { username: string; }) => l.username === username);
      like.next(likeObj);
    })

    return like.asObservable();
  }

  addLike(likeBody: Object) {
    let body = new Subject<any>();
    this.http.post('http://localhost:8080/likes', likeBody).subscribe((res: any) => {
      body.next(likeBody);
    });
    return body.asObservable();
  }


  deleteLike(id: number) {
    this.http.delete('http://localhost:8080/likes/' + id, {observe: 'response'}).subscribe((res: any) => {

    })
  }
}
