const { User, ListHistory } = require("../../models/user.model")
const moment = require('moment')
const ENV_VAR = require('../../config/vars')
const mongoose = require("mongoose")

describe("User model", () => {
    const currDate = moment().format(ENV_VAR.DATE_FORMAT)
	const his1 = new ListHistory({
		path: "raw_path_1.png",
		imageId: "image1.png",
		info: {
			grad_cam: {
				glaucoma: "/image/others_glaucoma_2.jpg",
				others: "/image/others_glaucoma_7.jpg",
			},
			probabilities: {
				cataract: 0.0030506225302815437,
				"diabetic retinopathy": 0.000014924326933396515,
				glaucoma: 0.9856300950050354,
				"macular degeneration": 0.09702236205339432,
				"macular edema": 0.00004124172846786678,
				normal: 0.00002181360287067946,
				"optic neuritis/neuropathy": 0.005298559088259935,
				others: 0.9360964894294739,
				"retinal vascular occlusion": 0.00006326170114334673,
			},
		},
	}).history

	it("check history content", () => {
		expect(Object.keys(his1).length).toBe(1)
		expect(his1).toHaveProperty(currDate)
	})

	const his2 = new ListHistory({
		path: "raw_path_2.png",
		imageId: "image2.png",
		info: {
			grad_cam: {
				glaucoma: "/image/others_glaucoma_2.jpg",
				others: "/image/others_glaucoma_7.jpg",
			},
			probabilities: {
				cataract: 0.0030506225302815437,
				"diabetic retinopathy": 0.000014924326933396515,
				glaucoma: 0.9856300950050354,
				"macular degeneration": 0.09702236205339432,
				"macular edema": 0.00004124172846786678,
				normal: 0.00002181360287067946,
				"optic neuritis/neuropathy": 0.005298559088259935,
				others: 0.9360964894294739,
				"retinal vascular occlusion": 0.00006326170114334673,
			},
		},
	}).history

    it("check 2 history contents have different value", () => {
		expect(mongoose.Types.ObjectId.isValid(his1[currDate][0].id)).toBe(true)
		expect(his1[currDate][0].id).not.toBe(his2[currDate][0].id)
    })
    
	const user = new User({
		uid: mongoose.Types.ObjectId(),
        name: "test",
        email: "test123123@gmail.com",
        avatar: "avatarTest.png",
    })
	user.mergeHistory(his1)

	it("check user history", () => {
		expect(user._id).toBeDefined()
        expect(user.history.length).toBe(1)
        
        user.mergeHistory(his2)
        expect(user.history.length).toBe(1)
        expect(user.history[0][currDate].length).toBe(2)
	})
})
