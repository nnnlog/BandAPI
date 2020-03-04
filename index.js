const axios = require("axios");
const instance = axios.create({
	baseURL: "https://auth.band.us/"
})

class BandAPI {

	/**
	 * BandAPI constructor.
	 *
	 * @param client_id         Client ID of service
	 * @param client_secret     Client Secret of service
	 * @param access_token      Access Token
	 */
	constructor(client_id, client_secret, access_token = null) {
		this._client_id = client_id;
		this._client_secret = client_secret;
		this._access_token = access_token;
	}

	setToken(token) {
		this._access_token = token;
	}

	getAuthorizationText() {
		return `Basic ${Buffer.from(`${this._client_id}:${this._client_secret}`).toString("base64")}`;
	}

	getRedirectURI(redirect_uri) {
		return `https://auth.band.us/oauth2/authorize?response_type=code&client_id=${this._client_id}&redirect_uri=${encodeURI(redirect_uri)}`;
	}

	getToken(code) {
		return new Promise(((resolve, reject) => {
			instance.get(`/oauth2/token?grant_type=authorization_code&code=${code}`, {
				headers: {
					"Authorization": this.getAuthorizationText()
				}
			}).then(res => {
				try{
					let data = res.data;
					if (data !== undefined && data.access_token !== undefined) {
						resolve(data.access_token);
						return;
					}
					reject(res); //TODO: return Error instance
				}catch (e) {
					reject(e);
				}
			}).catch(e => reject(e));
		}));
	}

}

module.exports = BandAPI;