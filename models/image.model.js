const mongoose = require("mongoose")
const Schema = mongoose.Schema
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
 * Methods
 */
imageSchema.method({
	//<!-- Transform data before return -->
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

	//<!-- Add info and findings from machine learning server -->
	/**
	 * @param {Object} result - The info or findings.
	 */
	updateResult(result) {
		if (typeof result !== "object")
			return new Error({ message: "input result must be object" })

		const newResult = new ResultInfo(this.result)
		newResult.update = result
		this.result = newResult
	},
})

/**
 * Statics
 */
imageSchema.statics = {
	//<!-- Get image by Id -->
	/**
	 * @param {String} id - The image Id returned from machine learning server.
	 * @returns {Promise<PredictedResult, error>}
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

	//<!-- Get list images -->
	/**
	 * @param {String} page - Current page.
	 * @param {String} perPage - Items each page.
	 * @param {String} id - ownerId of images.
	 * @param {Object} data - other filter parameters besides ownerId.
	 * @returns {Promise<Array, error>}
	 */
	async list({ page = 1, perPage = 10, id, ...data }) {
		try{
			const keys = Object.keys(data)
			const queryString = {}
	
			keys.map((key) => {
				if (key === "date") {
					return (queryString["createdAt"] = {
						$gte: new Date(data[key][0]).setHours(0, 0, 0, 0),
						$lte: new Date(data[key][1]).setHours(23, 59, 59, 999),
					})
				} else if (key === "disease") {
					if (typeof data[key] === "string") data[key] = [data[key]]
					return (data[key].map((item) => {
						(queryString[`result.findings.${item}`] = {
							$gte: ENV_VAR.SEARCH_IMAGE_THRESHOLD,
						})
					}))
				}
				queryString[key] = data[key]
			})
	
			const listHistory = await this.find({ ownerId: id, ...queryString }).sort({
				date: "descending",
			})
	
			const transformedList = listHistory.map((his) => his.transform())
			return transformedList
		} catch (err) {
			return err
		}
	},

	//<!-- Update images -->
	/**
	 * @param {String} id - imageId.
	 * @param {Object} data - data needed to update.
	 * @returns {Promise<PredictedResult, error>}
	 */
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
