import e from "express";
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true
    },
    eid: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
   
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;

