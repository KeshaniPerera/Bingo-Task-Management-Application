import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Project from './models/project.model.js';
import Employee from './models/employee.model.js';
import Task from './models/task.model.js';
import cors from 'cors';
import { GridFSBucket } from 'mongodb';
import multer from 'multer';  
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors()); // Use CORS middleware

let gridfsBucket;

connectDB().then((conn) => {
    const db = conn.connection;
    gridfsBucket = new GridFSBucket(db.db, { bucketName: 'uploads' });
    console.log('GridFS initialized');
}).catch(err => {
    console.error('Error initializing GridFS:', err);
});

// Setup multer middleware
const upload = multer();

// Upload attachment
app.post('/api/uploadtaskAttachment', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: 'File is required' });
    }

    const filename = file.originalname;
    const mimeType = file.mimetype; // Extract the correct MIME type

    // Open an upload stream in GridFS
    const uploadStream = gridfsBucket.openUploadStream(filename, {
        contentType: mimeType,
    });

    // Pipe the file buffer to the upload stream
    uploadStream.end(file.buffer, (error) => {
        if (error) {
            console.error('File upload error:', error);
            return res.status(500).json({ success: false, message: 'File upload failed' });
        }
        res.status(201).json({ success: true, message: 'File uploaded successfully', fileId: uploadStream.id });
    });
});

// Download an attachment by filename
app.get('/api/downloadAttachment/:filename', (req, res) => {
    const { filename } = req.params;

    try {
        const downloadStream = gridfsBucket.openDownloadStreamByName(filename);

        // Set response headers
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });

        // Pipe the download stream to the response
        downloadStream
            .on('error', (error) => {
                console.error('Error downloading file:', error);
                res.status(500).json({ success: false, message: 'Error downloading file' });
            })
            .pipe(res)
            .on('finish', () => {
                console.log('File downloaded successfully');
            });
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ success: false, message: 'Error fetching file' });
    }
});

// View or display an attachment by ID
// View or display an attachment by filename
app.get('/api/viewAttachmentByName/:filename', async (req, res) => {
    const { filename } = req.params;

    try {
        const file = await gridfsBucket.find({ filename }).toArray();

        if (!file || file.length === 0) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        // Set content type based on the MIME type
        res.setHeader('Content-Type', file[0].contentType);
        
        // Open a stream to the file from GridFS and pipe it to the response
        const downloadStream = gridfsBucket.openDownloadStream(file[0]._id);
        downloadStream.pipe(res); // Stream the file directly to the response
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ success: false, message: 'Error fetching file' });
    }
});







// Get all projects
app.get('/api/manager/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get ('/api/employee/tasks',async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ success: false, message: error.message });
    }
})


// Get tasks by employee name
app.get('/api/employee/projects/employee/:employee', async (req, res) => {
    const { employee } = req.params;
    console.log("Fetching projects for employee:", employee); // Debugging log
    try {
        const projects = await Task.find({ 'assignedTo': employee });
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// Get a single project by ID
app.get('/api/manager/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get tasks by project
app.get('/api/manager/tasks/:project', async (req, res) => {
    const { project } = req.params;
    try {
        const tasks = await Task.find({ project });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create a new project
app.post('/api/manager/projects', async (req, res) => {
    const project = req.body;
    if (!project.name || !project.description || !project.startDate || !project.endDate || !project.status) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const newProject = new Project(project);
    try {
        await newProject.save();
        res.status(201).json({ success: true, data: newProject });
    } catch (error) {
        console.log("Error creating project: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create a new task
app.post('/api/manager/uploadtask', async (req, res) => {
    const task = req.body;
    if (!task.title || !task.description || !task.assignedTo || !task.dueDate || !task.status || !task.project || !task.attachment) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newTask = new Task(task);
    try {
        await newTask.save();
        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        console.log("Error creating Task: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update task status by ID
app.put('/api/employee/updatetaskstatus/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        console.log("Error updating Task status: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});


// Update project status
app.put('/api/manager/updateprojectstatus/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        const updatedStatus = await Project.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedStatus) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.status(200).json({ success: true, data: updatedStatus });
    } catch (error) {
        console.log("Error updating Task status: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});



// Create a new employee
app.post('/api/manager/employees', async (req, res) => {
    const employee = req.body;
    if (!employee.fullname || !employee.email || !employee.eid || !employee.contact || !employee.password || !employee.position) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const newEmployee = new Employee(employee);
    try {
        await newEmployee.save();
        res.status(201).json({ success: true, data: newEmployee });
    } catch (error) {
        console.log("Error creating employee: " + error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all employees
app.get('/api/manager/employees', async (req, res) => {
    try {
        const employee = await Employee.find();
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    connectDB();
    console.log("Server started on http://localhost:" + PORT);
});
