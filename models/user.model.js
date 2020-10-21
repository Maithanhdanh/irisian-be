const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ENV_VAR = require("../config/vars")
const moment = require("moment")
const { PredictedResult, ResultInfo } = require ('./image.model')
class ListHistory {
	constructor({ path, imageId, predictedInfo }) {
		this.date = moment().format(ENV_VAR.DATE_FORMAT)
		this.path = path
		this.imageId = imageId.replace("/image/", "")
		this.predictedInfo = predictedInfo
		this.id = mongoose.Types.ObjectId()
	}

	get history() {
		return {
			[this.date]: [
				{
					id: this.id,
					path: this.path,
					imageId: this.imageId,
					predictedInfo: this.predictedInfo,
				},
			],
		}
	}
}

const userSchema = new Schema(
	{
		uid: { type: String, required: true },
		name: { type: String, default: "" },
		email: { type: String, match: /^\S+@\S+\.\S+$/, required: true },
		avatar: { type: String, default: "" },
		history: { type: Array, default: [] },
	},
	{
		timestamps: true,
	}
)

userSchema.pre("save", async function save(next) {
	try {
		return next()
	} catch (error) {
		return next(error)
	}
})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtual
 */
userSchema.pre("update", async function (next) {
	try {
		this.updateAt = new Date()
		if (!this.name || this.name.trim() === "") delete this.name
		if (!this.avatar || this.avatar.trim() === "") delete this.avatar

		return next()
	} catch (error) {
		return next(error)
	}
})

/**
 * Methods
 */
userSchema.method({
	transform() {
		const transformed = {}
		const fields = ["uid", "name", "email", "avatar", "history"]

		fields.forEach((field) => {
			transformed[field] = this[field]
		})

		return transformed
	},

	adminRetrieve() {
		const transformed = {}
		const fields = ["uid", "id", "name", "email", "avatar"]

		fields.forEach((field) => {
			transformed[field] = this[field]
		})

		return transformed
	},

	mergeHistory(his) {
		const date = Object.keys(his)
		const listDate = getListDateFromHistory(this.history)

		if (listDate.includes(date))
			return this.history[listDate.indexOf(date)][date].push(his[date][0])

		return this.history.push(his)
	},
})

const getListDateFromHistory = (history) => {
	return history.map((eachHis) => Object.keys(eachHis)[0])
}
/**
 * Statics
 */
userSchema.statics = {
	async getUserDetail(email) {
		try {
			//<!-- Get User based on email -->
			const userModel = await this.findOne({ email: email }).exec()

			if (!userModel) return null
			//transform data

			return userModel
		} catch (error) {
			throw error
		}
	},
	/**
	 * Get user
	 *
	 * @param {ObjectId} id - The objectId of user.
	 * @returns {Promise<User, APIError>}
	 */
	async get(id) {
		try {
			let user

			if (mongoose.Types.ObjectId.isValid(id)) {
				user = await this.findOne({ uid: id }).exec()
			}
			if (user) {
				// const listHistory = await PredictedResult.list({id:user.uid})
				// user.recent_activities = listHistory
				return user
			}

			throw new Error({ message: "User does not exist" })
		} catch (error) {
			throw error
		}
	},

	async update(id, { ...data }) {
		try {
			let user

			if (mongoose.Types.ObjectId.isValid(id)) {
				user = await this.findOne({ uid: id }).exec()
			}
			if (user) {
				const keys = Object.keys(data)
				keys.map((key) => {
					user[key] = data[key]
				})
				user.save()
				return user
			}

			throw new Error({ message: "User does not exist" })
		} catch (error) {
			throw error
		}
	},
}

const User = mongoose.model("profile", userSchema, "user")
module.exports = { User, ListHistory }
