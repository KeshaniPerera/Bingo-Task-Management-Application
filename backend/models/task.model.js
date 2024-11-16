import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    assignedTo: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
    },
    project: {
        type: String,
        required: true
        
    }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;