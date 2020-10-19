const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ENV_VAR = require("../config/vars")
const moment = require("moment")

class ListHistory {
	constructor({ path, imageId, info }) {
		this.date = moment().format(ENV_VAR.DATE_FORMAT)
		this.path = path
		this.imageId = imageId
		this.info = info
		this.id = mongoose.Types.ObjectId()
	}

	get history() {
		return {
			[this.date]: [{
				id: this.id,
				path: this.path,
				imageId: this.imageId,
				info: this.info,
			}],
		}
	}
}

const userSchema = new Schema(
	{
		uid: { type: String, required: true },
		name: { type: String },
		email: { type: String, match: /^\S+@\S+\.\S+$/, required: true },
		avatar: { type: String },
		history: { type: Array },
	},
	{
		timestamps: true,
	}
)

userSchema.pre("save", async function save(next) {
	try {
		//   if (!this.isModified("password")) return next();

		//   const rounds = env === "test" ? 1 : 10;

		//   const hash = await bcrypt.hash(this.password, rounds);
		//   this.password = hash;

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
		const fields = ["name", "email", "avatar", "history"]

		fields.forEach((field) => {
			transformed[field] = this[field]
		})

		return transformed
	},

	adminRetrieve() {
		const transformed = {}
		const fields = ["id", "name", "email", "avatar"]

		fields.forEach((field) => {
			transformed[field] = this[field]
		})

		return transformed
	},

	mergeHistory(his) {
		const date = Object.keys(his)
        const listDate = getListDateFromHistory(this.history)

		if (listDate.includes(date))
			return this.history[listDate.indexOf(date)][date].push(his[date])

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
				user = await this.findOne({uid:id}).exec()
			}
			if (user) {
				return user
			}

			throw new Error({message: "User does not exist"})
		} catch (error) {
			throw error
		}
	},

	async update(id, {...data}) {
		try {
			let user

			if (mongoose.Types.ObjectId.isValid(id)) {
				user = await this.findOne({uid:id}).exec()
			}
			if (user) {
				const keys = Object.keys(data)
				keys.map(key => {
					user[key] = data[key]
				})
				user.save()
				return user
			}

			throw new Error({message: "User does not exist"})
		} catch (error) {
			throw error
		}
	}
}

const User = mongoose.model("profile", userSchema, "user")
module.exports = { User, ListHistory }
