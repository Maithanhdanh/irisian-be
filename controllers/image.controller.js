const responseReturn = require("../response/responseReturn");
const { Diagnosis, Medicine } = require("../models/image.model")
const {Patient, ListHistory} = require("../models/image.model")
const { validationResult } = require('express-validator');

/** 
    * ADD PATIENT
    * 
    * @body patient_name    (String) patient's name             (required)
    * @body dob             (string) patient's date of birth    (required)
    * @body gender          (string) patient's gender           (required)
    * @body phone           (string) patient's phone            (required)
    * @body address         (string) patient's address          (optional)
    * 
    * @return 200 - 'Patient is added' || 500 - errors
**/
exports.addDiagnosis = async (req, res, next) => {
    const errors = validationResult(req);
    let resReturn = new responseReturn();
    if (!errors.isEmpty()) {
        resReturn.failure(res, 500, errors.array())
        return;
    }

    const { patient_id, symptoms, medicine, numDates, userId } = req.body;
    
    try {
        const existPatient = await Patient.get(patient_id);
        if(existPatient === null) {
            resReturn.failure(res, 500, {message:"Inexistent Patient"})
            return
        }

        const newMedicine = new Medicine({name:medicine, numDates})

        const newDiagnosis = new Diagnosis({ doctor_id:userId, patient_id, symptoms, medicine:newMedicine, date:new Date()})
        const doc = await newDiagnosis.save()
        
        const newHistory = new ListHistory({doctor_id:userId, diagnosis_id:doc.id, date:new Date()})
        existPatient.history.push(newHistory)

        const newPatient = await existPatient.save()
        resReturn.success(req, res, 200, {message:"new Diagnosis is added",diagnosisID:doc.id})
    } catch(errors) {
        resReturn.failure(req, res, 500, errors)
    }
};

/** 
    * SEARCH PATIENTS
    * 
    * @query patient_name    (String) patient's name             (required)
    * @query dob             (string) patient's date of birth    (required)
    * @query gender          (string) patient's gender           (required)
    * @query phone           (string) patient's phone            (required)
    * @query address         (string) patient's address          (optional)
    * @query date_come       (string) patient's address          (optional)
    * 
    * @return 200 - list of patient || 500 - errors
**/
exports.searchDiagnosis = async (req, res, next) => {
    const errors = validationResult(req);
    let resReturn = new responseReturn();
    if (!errors.isEmpty()) {
        resReturn.failure(res, 500, errors.array())
        return;
    }

    const { diagnosis_id } = req.body;

    try {
        const listDiagnosis = []
        diagnosis_id.map(async id=>{
            const doc = await Diagnosis.get(id)
            listDiagnosis.push(await doc.transform())
            
            if(listDiagnosis.length === diagnosis_id.length){
                resReturn.success(req, res, 200, listDiagnosis)
            }
        })

    } catch (errors) {
        resReturn.failure(req, res, 500, errors)
    }

};

/** 
    * SEARCH PATIENT BY ID
    * 
    * @query id    (String) patient's id    (required)
    * 
    * @return 200 - patient's profile || 500 - errors
**/
exports.getDiagnosis = async (req, res, next) => {
    const errors = validationResult(req);
    let resReturn = new responseReturn();
    if (!errors.isEmpty()) {
        resReturn.failure(res, 500, errors.array())
        return;
    }

    const patientID = req.query.id

    try {
        const doc = await Patient.findById(patientID).exec();
        resReturn.success(res, 200, doc)
    } catch (errors) {
        resReturn.failure(res, 500, errors)
    }
};

/** 
    * UPDATE PATIENT INFO
    * 
    * @query id    (String) patient's id    (required)
    * 
    * @return 200 - patient's profile || 500 - errors
**/
exports.updateDiagnosis = async (req, res, next) => {
    const errors = validationResult(req);
    let resReturn = new responseReturn();
    if (!errors.isEmpty()) {
        resReturn.failure(res, 500, errors.array())
        return;
    }
    
};