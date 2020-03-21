const axios = require("axios");
const auth = axios.create({
	baseURL: "https://auth.band.us/"
});
const api = axios.create({
	baseURL: "https://openapi.band.us/"
});

const querystring = require("querystring");

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
			}).catch(e => reject(e.response.data));
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
			}).catch(e => reject(e.response.data));
		});
	}

	/**
	 * 최근 게시글을 가져옵니다.
	 * @link https://developers.band.us/develop/guide/api/get_posts
	 *
	 * @var {string}        band_key       게시글을 가져올 밴드 식별자
	 * @var {null|string}   next_paging    다음 페이징 호출용 파라미터 정보
	 * @var {null|string}   locale         국가 및 언어 (ex. en_US)
	 *
	 * @returns {Promise<Object>}
	 */
	getPosts(band_key, next_paging = null, locale = null) {
		return new Promise((resolve, reject) => {
			api.get("/v2/band/posts", {
				params: {
					access_token: this._access_token,
					band_key: band_key,
					locale: locale,
					limit: 20,
					after: next_paging
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
			}).catch(e => reject(e.response.data));
		});
	}

	/**
	 * 특정 글의 상세 정보를 조회합니다.
	 * @link https://developers.band.us/develop/guide/api/get_post
	 *
	 * @var {string}    band_key       게시글을 가져올 밴드 식별자
	 * @var {string}    post_key       글 식별자
	 *
	 * @returns {Promise<Object>}
	 */
	getPost(band_key, post_key) {
		return new Promise((resolve, reject) => {
			api.get("/v2.1/band/post", {
				params: {
					access_token: this._access_token,
					band_key: band_key,
					post_key: post_key
				}
			}).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.result_code === 1) {
						resolve(data); //TODO: return Post
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			}).catch(e => reject(e.response.data));
		});
	}

	/**
	 * 특정 밴드에 글을 작성합니다.
	 * @link https://developers.band.us/develop/guide/api/write_post
	 *
	 * @var {string}    band_key       밴드 식별자
	 * @var {string}    content        본문 내용
	 * @var {boolean}   do_push        수신 설정된 멤버에게 푸시와 새소식 전달
	 *
	 * @returns {Promise<Object>}
	 */
	writePost(band_key, content, do_push = false) {
		return new Promise((resolve, reject) => { //왜 주소의 쿼리로만 데이터를 수신받는지 모르겠다.
			api.post(`/v2.2/band/post/create?${querystring.stringify({
				access_token: this._access_token,
				band_key: band_key,
				content: content,
				do_push: !!+do_push
			})}`).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.result_code === 1) {
						resolve(data); //TODO: return PostResult
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			}).catch(e => reject(e.response.data));
		});
	}

	/**
	 * 특정 글을 삭제하는 API 입니다.
	 * @link https://developers.band.us/develop/guide/api/remove_post
	 *
	 * @var {string}    band_key       밴드 식별자
	 * @var {string}    post_key       글 식별자
	 *
	 * @returns {Promise<Object>}
	 */
	deletePost(band_key, post_key) {
		return new Promise((resolve, reject) => {
			api.post(`/v2/band/post/remove?${querystring.stringify({
				access_token: this._access_token,
				band_key: band_key,
				post_key: post_key
			})}`).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.result_code === 1) {
						resolve(data); //TODO: return PostResult
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			}).catch(e => reject(e.response.data));
		});
	}

	/**
	 * 특정 글에 달린 댓글 목록을 조회합니다.
	 * @link https://developers.band.us/develop/guide/api/get_comments
	 *
	 * @var {string}        band_key       게시글을 가져올 밴드 식별자
	 * @var {string}        post_key       글 식별자
	 * @var {boolean}       sort           정렬 종류 (true: 생성순 정렬, false: 최신순 정렬)
	 * @var {null|string}   next_paging    다음 페이징 호출용 파라미터 정보
	 *
	 * @returns {Promise<Object>}
	 */
	getComments(band_key, post_key, sort = true, next_paging = null) {
		return new Promise((resolve, reject) => {
			api.get("/v2/band/post/comments", {
				params: {
					access_token: this._access_token,
					band_key: band_key,
					post_key: post_key,
					sort: `${sort ? "+" : "-"}created_at`,
					limit: 20,
					after: next_paging
				}
			}).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.result_code === 1) {
						resolve(data); //TODO: return Comment[]
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			}).catch(e => reject(e.response.data));
		});
	}

	/**
	 * 로그인 사용자가 특정 밴드에 쓰기/삭제 권한을 가지고 있는지 조회합니다.
	 * @link https://developers.band.us/develop/guide/api/get_post_permission
	 *
	 * @var {string}    band_key             게시글을 가져올 밴드 식별자
	 * @var {boolean}   posting              글 작성 권한
	 * @var {boolean}   commenting           댓글 작성 권한
	 * @var {boolean}   contents_deletion    글/댓글 삭제 권한
	 *
	 * @returns {Promise<Object>}
	 */
	hasPermissions(band_key, {posting = false, commenting = false, contents_deletion = false}) {
		return new Promise((resolve, reject) => {
			api.get("/v2/band/permissions", {
				params: {
					access_token: this._access_token,
					band_key: band_key,
					permissions: [posting ? "posting" : "", commenting ? "commenting" : "", contents_deletion ? "contents_deletion" : ""].filter(v => v !== "").join(",")
				}
			}).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.result_code === 1) {
						resolve(data); //TODO: return Comment[]
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			}).catch(e => reject(e.response.data));
		});
	}

	/**
	 * 특정 밴드의 앨범 목록을 조회합니다.
	 * @link https://developers.band.us/develop/guide/api/get_albums
	 *
	 * @var {string}        band_key       밴드 식별자
	 * @var {null|string}   next_paging    다음 페이징 호출용 파라미터 정보
	 *
	 * @returns {Promise<Object>}
	 */
	getAlbums(band_key, next_paging = null) {
		return new Promise((resolve, reject) => {
			api.get("/v2/band/albums", {
				params: {
					access_token: this._access_token,
					band_key: band_key,
					limit: 20,
					after: next_paging
				}
			}).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.result_code === 1) {
						resolve(data); //TODO: return Photo[]
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			}).catch(e => reject(e.response.data));
		});
	}

	/**
	 * 특정 밴드의 사진 목록을 조회합니다.
	 * @link https://developers.band.us/develop/guide/api/get_photos
	 *
	 * @var {string}        band_key        밴드 식별자
	 * @var {null|string}   photo_album_key 앨범 식별자
	 * @var {null|string}   next_paging     다음 페이징 호출용 파라미터 정보
	 *
	 * @returns {Promise<Object>}
	 */
	getPhotos(band_key, photo_album_key, next_paging = null) {
		return new Promise((resolve, reject) => {
			api.get("/v2/band/album/photos", {
				params: {
					access_token: this._access_token,
					band_key: band_key,
					photo_album_key: photo_album_key,
					limit: 20,
					after: next_paging
				}
			}).then(res => {
				try {
					let data = res.data;
					if (data !== undefined && data.result_code === 1) {
						resolve(data); //TODO: return Photo[]
						return;
					}
					reject(res); //TODO: return Error instance
				} catch (e) {
					reject(e);
				}
			}).catch(e => reject(e.response.data));
		});
	}

}

module.exports = BandAPI;