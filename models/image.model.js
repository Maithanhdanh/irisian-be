const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")
const ENV_VAR = require("../config/vars")
const moment = require("moment")

class ResultInfo {
	constructor(oldData) {
		const oldKeys = Object.keys(oldData)
		oldKeys.map((key) => (this[key] = oldData[key]))
	}

	set update(data) {
		const keys = Object.keys(data)
		keys.map((key) => (this[key] = data[key]))
	}
}

const imageSchema = new Schema(
	{
		imageId: { type: String, required: true },
		noBackgroundImageId: { type: String, required: true },
		ownerId: { type: String, required: true },
		date: { type: String, default: moment().format(ENV_VAR.DATE_FORMAT) },
		result: { type: Object, default: {} },
	},
	{
		timestamps: true,
	}
)

imageSchema.pre("save", async function save(next) {
	try {
		this.imageId = this.imageId.replace("/image/", "")
		this.noBackgroundImageId = this.noBackgroundImageId.replace("/image/", "")

		return next()
	} catch (error) {
		return next(error)
	}
})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
imageSchema.pre("update", async function (next) {
	try {
		//   if (!this.isModified("password")) return next();

		//   const rounds = env === "test" ? 1 : 10;

		//   const hash = await bcrypt.hash(this.password, rounds);
		//   this.password = hash;
		this.updateAt = new Date()

		return next()
	} catch (error) {
		return next(error)
	}
})

/**
 * Methods
 */

imageSchema.method({
	transform() {
		const transformed = {}
		const fields = [
			"imageId",
			"noBackgroundImageId",
			"ownerId",
			"date",
			"result",
		]

		fields.forEach((field) => {
			if (field === "date") {
				transformed[field] = this[field].split("_").join("/")
			} else {
				transformed[field] = this[field]
			}
		})

		return transformed
	},

	updateResult(result) {
		if (typeof result !== "object")
			throw new Error({ message: "input result must be object" })
		const newResult = new ResultInfo(this.result)
		newResult.update = result
		this.result = newResult
	},
})

/**
 * Statics
 */
imageSchema.statics = {
	/**
	 * Get Result
	 *
	 * @param {ObjectId} id - The objectId of Result.
	 * @returns {Promise<Result, APIError>}
	 */
	async get(id) {
		try {
			let result

			result = await this.findOne({ imageId: id }).exec()
			if (result) {
				return result
			}

			throw new Error({ message: "Result does not exist" })
		} catch (error) {
			throw error
		}
	},
	/**
	 * List Results in descending order of 'createdAt' timestamp.
	 *
	 * @param {number} skip - Number of Results to be skipped.
	 * @param {number} limit - Limit number of Results to be returned.
	 * @returns {Promise<Result[]>}
	 */
	async list({ page = 1, perPage = 10, id, ...data }) {
		const keys = Object.keys(data)  
		const queryString = {}

		keys.map((key) => {
			if(key === "date") {
				return queryString["createdAt"] = {"$gte": new Date(data[key][0]), "$lt": new Date(data[key][1])}
			} else if(key === "disease"){
				if(typeof data[key] === 'string') data[key] = [data[key]]
				data[key].map((item)=>{
					return queryString[`result.findings.${item}`] = {"$gte": ENV_VAR.SEARCH_IMAGE_THRESHOLD}
				})
				return
			}
			queryString[key]=data[key]
		})

		const listHistory = await this.find({ ownerId:id, ...queryString })
			.skip((parseInt(page) - 1) * parseInt(perPage))
			.limit(parseInt(perPage))
			.sort({ date: "descending" })

			const transformedList = listHistory.map(his => his.transform())
		return transformedList
	},
	
	async update(id, { ...data }) {
		try {
			let image

			image = await this.findOne({ imageId: id }).exec()
			if (image) {
				const keys = Object.keys(data)
				keys.map((key) => {
					image[key] = data[key]
				})
				image.save()
				return image
			}

			throw new Error({ message: "Image does not exist" })
		} catch (error) {
			throw error
		}
	},
}

const PredictedResult = mongoose.model(
	"PredictedResult",
	imageSchema,
	"predicted_result"
)
module.exports = { PredictedResult, ResultInfo }
