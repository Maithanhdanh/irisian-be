const { User, ListHistory } = require("../../models/user.model")
const server = require("../../app")
const request = require("supertest")
const mongoose = require("mongoose")
const queryString = require("query-string")

const bodyRegis = {
	name: "testUser123",
	email: "test@gmail.com",
	password: "123123123",
}

beforeAll(async () => {
	try {
		jest.useFakeTimers()
		await User.deleteMany({ email: "test@gmail.com" })
	} catch (err) {
		console.log(err)
	}
})

afterAll(async () => {
	await User.deleteMany({ email: "test@gmail.com" })
	server.close()
})

describe("Authentication", () => {
	describe("global app status", () => {
		it("should return ok", async () => {
			const res = await request(server).get("/status").expect(200)
			expect(res.body).toBe("OK")
		})
	})

	describe("user routes status", () => {
		it("should return ok", async () => {
			const res = await request(server).get("/user/status").expect(200)
			expect(res.body).toBe("OK")
		})
	})

	describe("/add and /login", () => {
		it("should success", async () => {
			//<!-- Setup -->
			await request(server).post("/user/add").send(bodyRegis).expect(200)

			let bodyLogin = {
				email: bodyRegis.email,
				password: bodyRegis.password,
			}

			//<!-- Run test -->
			const res = await request(server)
				.post("/user/login")
				.send(bodyLogin)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(Object.keys(res.body.response.user).length).toBe(4)
			expect(mongoose.Types.ObjectId.isValid(res.body.response.user.uid)).toBe(
				true
			)
			expect(res.body.response.user.name).toBe(bodyRegis.name)
			expect(res.body.response.user.email).toBe(bodyRegis.email)
			expect(res.body.response.user.history.length).toBe(0)
			expect(res.body.response).toHaveProperty("refreshToken_expiresIn")
			expect(res.body.response).toHaveProperty("expiresIn")
			expect(res.body.response).toHaveProperty("accessToken")
			expect(res.body.response).toHaveProperty("role")
			expect(res.body.response.role).toBe("GUEST")
			expect(Object.keys(res.body.response).length).toBe(5)
			expect(res.headers["set-cookie"].length).not.toBe(0)

			refreshToken = res.headers["set-cookie"][0].split(";")[0].split("=")[1]
			expect(refreshToken).not.toBeNull()
			expect(refreshToken).not.toBeUndefined()
		})
	})

	describe("/search ", () => {
		beforeAll(async () => {
			let bodyLogin = {
				email: bodyRegis.email,
				password: bodyRegis.password,
			}
			const res = await request(server).post("/user/login").send(bodyLogin)
			return (accessToken = res.body.response.accessToken)
		})
		it("should success", async () => {
			//<!-- Setup -->
			let body = {
				email: "",
				name: "testUser",
			}
			let query = queryString.stringify(body)

			//<!-- Run test -->
			const res = await request(server)
				.get(`/user/search?${query}`)
				.set("authorization", `Bearer ${accessToken}`).expect(200)

			expect(res.body.error).toBe(false)
			expect(mongoose.Types.ObjectId.isValid(res.body.response[0].uid)).toBe(
				true
			)
		})
		it("should fail => missing token", async () => {
			//<!-- Setup -->
			let body = {
				email: "",
				name: "testUser",
			}
			let query = queryString.stringify(body)

			//<!-- Run test -->
			await request(server)
				.get(`/user/search?${query}`)
				.set("authorization", `Bearer `)
				.expect(401)
		})

		it("should fail => wrong token", async () => {
			//<!-- Setup -->
			let body = {
				email: "",
				name: "testUser",
			}
			let query = queryString.stringify(body)

			//<!-- Run test -->
			await request(server)
				.get(`/user/search?${query}`)
				.set("authorization", `Bearer 123123123asdasda`)
				.expect(403)
		})
	})

	describe("/get/:id user by id", () => {
		beforeAll(async () => {
			let bodyLogin = {
				email: bodyRegis.email,
				password: bodyRegis.password,
			}
			const res = await request(server).post("/user/login").send(bodyLogin)
			return uid = res.body.response.user.uid
		})
		

		it("should success", async () => {
			const res = await request(server)
				.get(`/user/get/${uid}`)
				.set("authorization", `Bearer ${accessToken}`)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(mongoose.Types.ObjectId.isValid(res.body.response.user.uid)).toBe(
				true
			)
			expect(res.body.response).toHaveProperty("user")
			expect(Object.keys(res.body.response.user).length).toBe(4)
		})
		it("should fail => missing token", async () => {
			await request(server)
				.get(`/user/get/${uid}`)
				.set("authorization", `Bearer `)
				.expect(401)
		})

		it("should fail => missing uid", async () => {
			await request(server)
				.get(`/user/get/ `)
				.set("authorization", `Bearer ${accessToken}`)
				.expect(404)
		})
	})

	describe("/token", () => {
		beforeAll(async () => {
			let bodyLogin = {
				email: bodyRegis.email,
				password: bodyRegis.password,
			}
			const res = await request(server).post("/user/login").send(bodyLogin)
			refreshToken = res.headers["set-cookie"][0].split(";")[0].split("=")[1]

			return refreshToken
		})

		it("should success", async () => {
			const res = await request(server)
				.get("/user/token")
				.set("Cookie", `refresh_token=${refreshToken}`)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(Object.keys(res.body.response.user).length).toBe(4)
			expect(mongoose.Types.ObjectId.isValid(res.body.response.user.uid)).toBe(
				true
			)
			expect(res.body.response.user.name).toBe(bodyRegis.name)
			expect(res.body.response.user.email).toBe(bodyRegis.email)
			expect(res.body.response.user.history.length).toBe(0)
			expect(res.body.response).toHaveProperty("expiresIn")
			expect(res.body.response).toHaveProperty("accessToken")
			expect(res.body.response).toHaveProperty("role")
			expect(res.body.response.role).toBe("GUEST")
			expect(Object.keys(res.body.response).length).toBe(4)
		})

		it("should fail => missing token", async () => {
			await request(server)
				.get("/user/token")
				.set("Cookie", "refresh_token=")
				.expect(400)
		})
	})

	describe("/update", () => {
		beforeAll(async () => {
			let bodyLogin = {
				email: bodyRegis.email,
				password: bodyRegis.password,
			}
			const res = await request(server).post("/user/login").send(bodyLogin)
			return (accessToken = res.body.response.accessToken)
		})

		afterAll(async () => {
			let body = {
				name: bodyRegis.name,
			}
			await request(server)
				.post("/user/update")
				.set("authorization", `Bearer ${accessToken}`)
				.send(body)
				.expect(200)
		})

		it("should success", async () => {
			let body = {
				name: "Dantis",
				avatar: "dantis.png",
			}
			const res = await request(server)
				.post("/user/update")
				.set("authorization", `Bearer ${accessToken}`)
				.send(body)
				.expect(200)

			setTimeout(async () => {
				expect(res.body.error).toBe(false)
				expect(res.body.response.user.name).toBe(body.name)
			}, 1000)
		})

		it("should fail => missing token", async () => {
			let body = {
				name: "Dantis",
				avatar: "dantis.png",
			}
			res = await request(server)
				.post("/user/update")
				.set("authorization", `Bearer `)
				.send(body)
				.expect(401)
		})
	})

	describe("/logout", () => {
		beforeEach(async () => {
			let bodyLogin = {
				email: bodyRegis.email,
				password: bodyRegis.password,
			}
			const res = await request(server).post("/user/login").send(bodyLogin)
			refreshToken = res.headers["set-cookie"][0].split(";")[0].split("=")[1]

			return refreshToken
		})

		it("should success", async () => {
			const res = await request(server)
				.get("/user/logout")
				.set("Cookie", `refresh_token=${refreshToken}`)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(res.body.response).toBe("Removed Token")
		})

		it("should fail => missing token", async () => {
			await request(server)
				.get("/user/logout")
				.set("Cookie", `refresh_token=`)
				.expect(401)
		})
	})
})
