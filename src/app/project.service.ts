import { Injectable } from '@angular/core';
import * as types from './types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SessionService } from './session.service';
import { ConstService } from './const.service';
import { Observable } from 'rxjs/Observable';

interface PingResponse {
  pong: boolean;
}

@Injectable()
export class ProjectService {
  constructor(
    private http: HttpClient,
    private _const: ConstService,
    private ss: SessionService
  ) {}

  // returns last updated projects first
  listByNick(nick: string): Promise<types.Project[]> {
    let p = new HttpParams();
    p = p.set('nick', nick);
    p = p.set('token', this.ss.getToken());
    return new Promise<types.Project[]>((resolve, reject) => {
      this.http
        .get<types.Project[]>(this._const.url + '/v1/projects', {
          params: p
        })
        .subscribe(
          projs => {
            projs = projs.sort((a, b) => {
              if (a.UpdatedAt === b.UpdatedAt) {
                return 0;
              }
              if (a.UpdatedAt < b.UpdatedAt) {
                return 1;
              }
              return -1;
            });
            resolve(projs);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  getByAuthorAndProjectName(author: string, projectName: string) {
    let p = new HttpParams();
    p = p.set('author', author);
    p = p.set('project', projectName);
    p = p.set('token', this.ss.getToken());
    return new Promise<types.Project>((resolve, reject) => {
      this.http
        .get<types.Project>(this._const.url + '/v1/project', {
          params: p
        })
        .subscribe(
          proj => {
            if (proj.Builds) {
              proj.Builds = proj.Builds.sort((a, b) => {
                if (a.CreatedAt === b.CreatedAt) {
                  return 0;
                }
                if (a.CreatedAt < b.CreatedAt) {
                  return 1;
                }
                return -1;
              });
            }
            if (proj.Endpoints) {
              proj.Endpoints = proj.Endpoints.sort((a, b) => {
                if (a.CreatedAt === b.CreatedAt) {
                  return 0;
                }
                if (a.CreatedAt < b.CreatedAt) {
                  return 1;
                }
                return -1;
              });
            }
            resolve(proj);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  getStatus(author: string, projectName: string): Promise<PingResponse> {
    return new Promise<PingResponse>((resolve, reject) => {
      this.http
        .get<PingResponse>(
          this._const.url + '/app/' + author + '/' + projectName + '/ping'
        )
        .subscribe(
          pr => {
            resolve(pr);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  star(projectId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .put(this._const.url + '/v1/star', {
          projectId: projectId,
          token: this.ss.getToken()
        })
        .subscribe(
          () => {
            resolve();
          },
          error => {
            reject(error);
          }
        );
    });
  }

  unstar(projectId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let p = new HttpParams();
      p = p.set('projectId', projectId);
      p = p.set('token', this.ss.getToken());
      this.http
        .delete(this._const.url + '/v1/star', {
          params: p
        })
        .subscribe(
          () => {
            resolve();
          },
          error => {
            reject(error);
          }
        );
    });
  }

  list(): Promise<types.Project[]> {
    let p = new HttpParams();
    p = p.set('token', this.ss.getToken());
    return new Promise<types.Project[]>((resolve, reject) => {
      this.http
        .get<types.Project[]>(this._const.url + '/v1/projects', {
          params: p
        })
        .subscribe(
          projs => {
            projs = projs.sort((a, b) => {
              if (a.UpdatedAt === b.UpdatedAt) {
                return 0;
              }
              if (a.UpdatedAt < b.UpdatedAt) {
                return 1;
              }
              return -1;
            });
            resolve(projs);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  save(project: types.Project): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .put(this._const.url + '/v1/project', {
          project: project,
          token: this.ss.getToken()
        })
        .subscribe(
          () => {
            resolve();
          },
          error => {
            reject();
          }
        );
    });
  }
}