export class User {
  constructor(
    public email: string,
    public id: string,
    public refreshToken: string,
    public birthdateThreshold: string,
    public lastInteractionThreshold: string,
    public workAnniversaryThreshold: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
