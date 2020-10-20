const { User, ListHistory } = require("../../models/user.model")
const server = require("../../app")
const request = require("supertest")
const mongoose = require("mongoose")
const queryString = require("query-string")
const requestAuth = request("http://3.1.49.93:5000")

beforeAll(async () => {
	jest.useFakeTimers()
})

afterAll(async () => {
	await User.deleteMany({email: "test"})
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

	describe("/add ", () => {
		it("should success", async () => {
			let bodyRegis = {
				name: "testUser123",
				email: "test@gmail.com",
				password: "123123123",
			}
			await request(server).post("/user/add").send(bodyRegis).expect(200)
			
			let bodyLogin = {
				email: "test@gmail.com",
				password: "123123123",
			}
			const res = await requestAuth.post("/auth/login").send(bodyLogin)
			return accessToken = res.body.response.accessToken
		})
	})

	describe("/search ", () => {
		beforeEach(async () => {
			let bodyLogin = {
				email: "test@gmail.com",
				password: "123123123",
			}
			const res = await requestAuth.post("/auth/login").send(bodyLogin)
			return accessToken = res.body.response.accessToken
		})
		it("should success", async () => {
			let body = {
				email: "",
				name: "testUser",
			}
			let query = queryString.stringify(body)

			const res = await request(server)
				.get(`/user/search?${query}`)
				.set("authorization", `Bearer ${accessToken}`)

			expect(res.body.error).toBe(false)
			expect(mongoose.Types.ObjectId.isValid(res.body.response[0].uid)).toBe(
				true
			)

			return uid = res.body.response[0].uid
		})
		it("should fail => missing token", async () => {
			let body = {
				email: "",
				name: "testUser",
			}
			let query = queryString.stringify(body)

			const res = await request(server)
				.get(`/user/search?${query}`)
				.set("authorization", `Bearer `).expect(401)
		})
	})

	describe("/get/:id user by id", () => {
		it("should success", async () => {
			const res = await request(server)
				.get(`/user/get/${uid}`)
				.set("authorization", `Bearer ${accessToken}`)
				.expect(200)

				console.log(res.body)
			expect(res.body.error).toBe(false)
			expect(mongoose.Types.ObjectId.isValid(res.body.response.uid)).toBe(true)
			expect(Object.keys(res.body.response).length).toBe(5)
		})
		
		it("should fail => missing token", async () => {
			const res = await request(server)
				.get(`/user/get/${uid}`)
				.set("authorization", `Bearer `)
				.expect(401)
		})

		it("should fail => missing uid", async () => {
			await request(server)
				.get(`/user/get/`)
				.set("authorization", `Bearer ${accessToken}`)
				.expect(404)
		})
	})

	describe("/update", () => {
		beforeEach(async () => {
			let bodyLogin = {
				email: "test@gmail.com",
				password: "123123123",
			}
			const res = await requestAuth.post("/auth/login").send(bodyLogin)
			return accessToken = res.body.response.accessToken
		})
		it("should success", async () => {
			let body ={
				name: "Dantis",
				avatar: "dantis.png"
			}
			const res = await request(server)
				.post('/user/update')
				.set("authorization", `Bearer ${accessToken}`)
				.send(body)
				.expect(200)
				
			expect(res.body.error).toBe(false)
			expect(res.body.response.name).toBe(body.name)
			expect(res.body.response.avatar).toBe(body.avatar)
		})

		it("should fail => missing token", async () => {
			let body ={
				name: "Dantis",
				avatar: "dantis.png"
			}
			res = await request(server)
				.post('/user/update')
				.set("authorization", `Bearer `)
				.send(body)
				.expect(401)
		})
	})
})
