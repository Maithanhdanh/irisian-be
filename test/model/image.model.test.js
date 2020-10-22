const { PredictedResult, ResultInfo } = require("../../models/image.model")
const ENV_VAR = require("../../config/vars")
const mongoose = require("mongoose")
const moment = require("moment")

describe("Image model", () => {
	describe("Image schema", () => {
		it("check image content", () => {
			const image = new PredictedResult({
				imageId: "cvzdfawerawerawer.png",
				noBackgroundImageId: "cvzdfawerawerawer.png",
				ownerId: mongoose.Types.ObjectId(),
			})

			expect(Object.keys(image).length).toBe(6)
			expect(image).toHaveProperty("date")
			expect(image).toHaveProperty("result")
			expect(image).toHaveProperty("result")
			expect(Object.keys(image.result).length).toBe(0)
		})

		it("check transformed image content", () => {
			const image = new PredictedResult({
				imageId: "cvzdfawerawerawer.png",
				noBackgroundImageId: "cvzdfawerawerawer.png",
				ownerId: mongoose.Types.ObjectId(),
			})
			const transformedDoc = image.transform()

			expect(Object.keys(transformedDoc).length).toBe(5)
			expect(transformedDoc).not.toHaveProperty("_id")
			expect(moment(transformedDoc.date, "DD/MM/YYYY", true).isValid()).toBe(
				true
			)
		})
	})

	describe("ResultInfo schema", () => {
		const info = {
			class: "fundus",
			eyeside: "right",
		}
		const info2 = {
			class: "fundus",
			eyeside: "left",
		}

		const findings = {
			cataract: 0.0030506225302815437,
			"diabetic retinopathy": 0.000014924326933396515,
			glaucoma: 0.9856300950050354,
			"macular degeneration": 0.09702236205339432,
			"macular edema": 0.00004124172846786678,
			normal: 0.00002181360287067946,
			"optic neuritis/neuropathy": 0.005298559088259935,
			others: 0.9360964894294739,
			"retinal vascular occlusion": 0.00006326170114334673,
		}

		const image = new PredictedResult({
			imageId: "cvzdfawerawerawer.png",
			noBackgroundImageId: "cvzdfawerawerawer.png",
			ownerId: mongoose.Types.ObjectId(),
		})

		it("update info", () => {
            image.updateResult({info})
            
            expect(typeof image.result).toBe('object')
            expect(image.result).toHaveProperty('info')
            expect(Object.keys(image.result).length).toBe(1)
            expect(image.result.info).toBe(info)

            image.updateResult({info:info2})
            
            expect(typeof image.result).toBe('object')
            expect(image.result).toHaveProperty('info')
            expect(Object.keys(image.result).length).toBe(1)
            expect(image.result.info).toBe(info2)
		})

		it("update findings", () => {
            image.updateResult({findings})
            
            expect(typeof image.result).toBe('object')
            expect(image.result).toHaveProperty('findings')
            expect(Object.keys(image.result).length).toBe(2)
            expect(image.result.findings).toBe(findings)
		})
	})
})
