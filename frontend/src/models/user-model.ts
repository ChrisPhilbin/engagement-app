export class User {
  constructor(
    public email: string,
    public id: string,
    public refreshToken: string,
    public birthdateThreshold: number,
    public lastInteractionThreshold: number,
    public workAnniversaryThreshold: number,
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
