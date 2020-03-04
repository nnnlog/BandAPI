const axios = require("axios");
const auth = axios.create({
	baseURL: "https://auth.band.us/"
});
const api = axios.create({
	baseURL: "https://openapi.band.us/"
});

class BandAPI {

	/**
	 * BandAPI constructor.
	 *
	 * @param {string}          client_id         Client ID of service
	 * @param {string}          client_secret     Client Secret of service
	 * @param {string|null}     access_token      Access Token
	 */
	constructor(client_id, client_secret, access_token = null) {
		this._client_id = client_id;
		this._client_secret = client_secret;
		this._access_token = access_token;
	}

	_getAuthorizationText() {
		return `Basic ${Buffer.from(`${this._client_id}:${this._client_secret}`).toString("base64")}`;
	}

	/**
	 * Access Token을 변경합니다.
	 *
	 * @param {string|null}     token
	 */
	setToken(token) {
		this._access_token = token;
	}

	/**
	 * Authorization code를 얻기 위한 링크를 생성합니다.
	 * @link https://developers.band.us/develop/guide/api/get_authorization_code_from_user
	 *
	 * @param   {string}    redirect_uri    Redirect URI of service
	 * @returns {string}
	 */
	getRedirectURI(redirect_uri) {
		return `https://auth.band.us/oauth2/authorize?response_type=code&client_id=${this._client_id}&redirect_uri=${encodeURI(redirect_uri)}`;
	}

	/**
	 * Authorization code를 받아 Access Token을 발급합니다.
	 * @link https://developers.band.us/develop/guide/api/get_authorization_code_from_user
	 *
	 * @param   {string}            code
	 * @returns {Promise<string>}
	 */
	getToken(code) {
		return new Promise(((resolve, reject) => {
			auth.get(`/oauth2/token?grant_type=authorization_code&code=${code}`, {
				headers: {
					"Authorization": this._getAuthorizationText()
				}
			}).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.access_token !== undefined) {
						resolve(data.access_token);
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			}).catch(e => reject(e));
		}));
	}

	/**
	 * 프로필을 조회합니다.
	 * @link https://developers.band.us/develop/guide/api/get_user_information
	 *
	 * @param band_key              null이면 기본 프로필을 조회하고, band_key이면 해당 밴드의 프로필을 조회합니다.
	 * @returns {Promise<Object>}
	 */
	getProfile(band_key = null) {
		return new Promise((resolve, reject) => {
			api.get("/v2/profile", {
				params: {
					access_token: this._access_token,
					band_key: band_key
				}
			}).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.result_code === 1) {
						resolve(data); //TODO: return Profile instance
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			})
		});
	}

	/**
	 * 접근 가능한 밴드 목록을 가져옵니다.
	 * @link https://developers.band.us/develop/guide/api/get_bands
	 *
	 * @returns {Promise<Object>}
	 */
	getBands() {
		return new Promise((resolve, reject) => {
			api.get("/v2.1/bands", {
				params: {
					access_token: this._access_token
				}
			}).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.result_code === 1) {
						resolve(data); //TODO: return Band[]
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			})
		});
	}

	/**
	 * 최근 게시글을 가져옵니다.
	 * @link https://developers.band.us/develop/guide/api/get_posts
	 *
	 * @var {string}        band_key       게시글을 가져올 밴드 식별자
	 * @var {null|string}   locale         국가 및 언어 (ex. en_US)
	 *
	 * @returns {Promise<Object>}
	 */
	getPosts(band_key, locale = null) {
		return new Promise((resolve, reject) => {
			api.get("/v2/band/posts", {
				params: {
					access_token: this._access_token,
					band_key: band_key,
					locale: locale
				}
			}).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.result_code === 1) {
						resolve(data); //TODO: return Post[]
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			})
		});
	}

}

module.exports = BandAPI;