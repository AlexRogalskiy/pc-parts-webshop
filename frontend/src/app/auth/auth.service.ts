import { Injectable } from '@angular/core';
import { UserModel } from "./user.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { PublicKeyResponseModel } from "./public-key-response.model";
import { CryptService } from "./crypt.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private cryptService: CryptService,
  ) {
  }

  public authenticatedUser: UserModel | null = null;

  login(email: string, password: string): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      this.httpClient.post<PublicKeyResponseModel>(environment.apiUrl + '/auth/login/initialize', {
        email,
      }).subscribe({
        next: async (response: PublicKeyResponseModel) => {
          const publicKey: CryptoKey = await this.cryptService.importPublicKey(response.publicKey);
          const encryptedPassword = await this.cryptService.encyptData(password, publicKey);
          this.httpClient.post<UserModel>(environment.apiUrl + '/auth/login', {
            email,
            password: encryptedPassword,
          }).subscribe({
            next: (user: UserModel) => {
              this.authenticatedUser = user;
              resolve(user);
            },
            error: (error: HttpErrorResponse) => {
              reject(error);
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        }
      });
    });
  }

  logout() {
    this.authenticatedUser = null;
    this.httpClient.post(environment.apiUrl + '/auth/logout', {});
  }

  register(email: string, password: string, firstName: string, middleName: string, lastName: string): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      this.httpClient.post<PublicKeyResponseModel>(environment.apiUrl + '/user/initialize', {
        email,
      }).subscribe({
        next: async (response: PublicKeyResponseModel) => {
          const publicKey: CryptoKey = await this.cryptService.importPublicKey(response.publicKey);
          const encryptedPassword = await this.cryptService.encyptData(password, publicKey);
          this.httpClient.post<UserModel>(environment.apiUrl + '/user', {
            email,
            password: encryptedPassword,
            firstName, middleName, lastName,
          }).subscribe({
            next: (user: UserModel) => {
              this.authenticatedUser = user;
              resolve(user);
            },
            error: (error: HttpErrorResponse) => {
              reject(error);
            }
          })
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        }
      })
    });
  }
}
