import axios from 'axios';

/**
 * An example API client
 */
class ExampleApi {
  private _apiBase: string;
  constructor(url: string) {
    this._apiBase = `${url}/v1`;
  }

  /**
   * An example API call
   */
  public async getSomething(): Promise<string> {
    const json = await axios.get<string>(`${this._apiBase}/something`);
    return json.data;
  }
}

export const example = new ExampleApi('');
