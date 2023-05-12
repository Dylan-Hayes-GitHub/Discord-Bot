import fetch from 'node-fetch';

export default class FissureService {
    private static readonly _fissureUrl = "https://api.warframestat.us/pc/fissures";

    public static async getFissures() {
        const response = await fetch(this._fissureUrl);
        const fissures = await response.json();
        return fissures;
    }
}
