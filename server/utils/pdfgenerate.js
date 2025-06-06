import puppeteer from 'puppeteer';
import Issue from '../model/issueModel.js';
import attendenceModel from '../model/attendenceMOdel.js';
import {User} from "../model/user.js"
import Admin from "../model/adminModel.js"
import Plaza from '../model/plazaModel.js';
import Project from '../model/projectModel.js';
import fs from 'fs';
import path from 'path';

export async function generatePDF(filters = {}) {
  let flag= 0;
  const { engineerId, projectId, plazaId, plazaMap, startDate, endDate } = filters;
 let query={};
    if (engineerId) {
      query['$or'] = [
        { reportedBy: engineerId },  // Filter by reportedBy
        { rectifiedBy: engineerId },  // Filter by rectifiedBy
      ];
    }
  
    if (projectId) {
      try {
        flag=1;
        // Fetch project and its plaza IDs
        const project = await Project.findById(projectId).populate("plazas", "_id");
        var name= project.projectName
    
        if (!project) {
          console.log("no projectFound");
          
          // return res.status(404).json({ message: "Project not found" });
        }
    
        const plazaIds = project.plazas.map(plaza => plaza._id);
    
        // Find only pending issues from those plazas
        var ProjectIssues = await Issue.find({
          plazaId: { $in: plazaIds },
          
        }).populate("reportedBy", "username").populate('plazaId').populate("rectifiedBy")
    
        // return res.status(200).json({
        //   message: "Pending issues fetched successfully",
        //   issues,
        // });
      } catch (error) {
        console.error("Error fetching issues:", error);
        // return res.status(500).json({ message: "Server error", error });
      }
    }
  
    if (plazaId) {
      console.log(plazaId);
      
      query['plazaId'] = plazaId;  // Filter specifically by plaza
    }
    if (plazaMap?.id) {
      query.plazaId = plazaMap.id;
    
      // Dynamic date range: today from 00:00:00 to 23:59:59
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today (midnight)
    
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Start of next day
    
      query.issueTime = { $gte: today, $lt: tomorrow };
    }
    
    
    
  
    if (startDate && endDate) {
      query['issueTime'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
  
    // Fetch filtered issues
    console.log(query);
    
    const issues = await Issue.find(query)
      .populate('reportedBy')
      .populate('rectifiedBy')
      .populate('plazaId');
  
    console.log("Fetched Issues:", issues.length);
  const tableRows = flag===0? (issues.map(issue => {
    const reportedBy = issue.reportedBy ? `${issue.reportedBy.firstName} ${issue.reportedBy.lastName}` : 'N/A';
    const rectifiedBy = issue.rectifiedBy ? `${issue.rectifiedBy.firstName} ${issue.rectifiedBy.lastName}` : 'N/A';
    const plazaName = issue.plazaId?.plazaName || 'N/A';

    return `
      <tr>
        <td>${issue.issueId}</td>
        <td>${issue.problemType}</td>
        <td>${reportedBy}</td>
        <td>${issue.description}</td>
        <td>${plazaName}</td>
        <td>${issue.issueTime?.toLocaleString() || 'N/A'}</td>
        <td>${issue.remarks}</td>
        <td>${rectifiedBy}</td>
        <td>${issue.rectifiedTime?.toLocaleString() || 'N/A'}</td>
      </tr>
    `;
  }).join('')) :(
    ProjectIssues.map(issue => {
      console.log(issue);
      
      const reportedBy = issue.reportedBy ? `${issue.reportedBy.username}` : 'N/A';
      const rectifiedBy = issue.rectifiedBy ? `${issue.rectifiedBy.firstName} ${issue.rectifiedBy.lastName}` : 'N/A';
      const plazaName = issue.plazaId?.plazaName || 'N/A';
  
      return `
        <tr>
          <td>${issue.issueId}</td>
          <td>${issue.problemType}</td>
          <td>${reportedBy}</td>
          <td>${issue.description}</td>
          <td>${plazaName}</td>
          <td>${issue.issueTime?.toLocaleString() || 'N/A'}</td>
          <td>${issue.remarks}</td>
          <td>${rectifiedBy}</td>
          <td>${issue.rectifiedTime?.toLocaleString() || 'N/A'}</td>
        </tr>
      `;
    }).join(''))
  

  const html = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        h1,h2 { text-align: center; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #999;
          padding: 8px;
          text-align: left;
          font-size: 12px;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <h1>Issue Report</h1>
      ${projectId ? `<h2>${name}</h2>` : (plazaMap && plazaMap.name ? `<h2>${plazaMap.name}</h2>` : '')}
      <table>
        <thead>
          <tr>
            <th>Issue ID</th>
            <th>Issue Type</th>
            <th>Reported By</th>
            <th>Description</th>
            <th>Plaza Name</th>
            <th>Issue Time</th>
            <th>Remarks</th>
            <th>Rectified By</th>
            <th>Rectified Time</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // required for VPS
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    console.log("PDF generated successfully. Size:", pdfBuffer.length, "bytes");
    return pdfBuffer;

    // To save to disk:
    // fs.writeFileSync(path.join(process.cwd(), 'issues_report.pdf'), pdfBuffer);

  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  }
}





export const genAttendancePdf = async (filters = {}) => {
  try {
    // Build the query
    const query = {};

    // Filter by user ID
    if (filters.userId) {
      query.user = filters.userId;
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = new Date(filters.startDate);
      if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }

    const attendanceRecords = await attendenceModel.find(query).populate('user').lean();
console.log(attendanceRecords);

const htmlContent = `
<html>
  <head>
    <style>
      body { font-family: Arial; padding: 20px; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      .status-present { color: green; font-weight: bold; }
      .status-absent { color: red; font-weight: bold; }
      .status-leave { color: orange; font-weight: bold; }
    </style>
  </head>
  <body>
    <h2>Attendance Report</h2>
    <table>
      <tr>
        <th>Employee Name</th>
        <th>Email</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
      ${attendanceRecords.map(record => {
        const statusClass = record.status === 'present'
          ? 'status-present'
          : record.status === 'absent'
          ? 'status-absent'
          : 'status-leave';
        return `
          <tr>
            <td>${record.user?.firstName || ''} ${record.user?.lastName || ''}</td>
            <td>${record.user?.email || ''}</td>
            <td class="${statusClass}">${record.status}</td>
            <td>${new Date(record.date).toLocaleDateString()}</td>
          </tr>
        `;
      }).join("")}
    </table>
  </body>
</html>
`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return pdfBuffer;

  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  }
};

export const generateProjectWisePdf= async()=>{

    const { projectId } = req.body;

  
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is not a valid" });
    }
  
    try {
      // Fetch project and its plaza IDs
      const project = await Project.findById(projectId).populate("plazas", "_id");
  
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      const plazaIds = project.plazas.map(plaza => plaza._id);
  
      // Find only pending issues from those plazas
      const issues = await Issue.find({
        plazaId: { $in: plazaIds },
        
      }).populate("reportedBy", "username").populate('plazaId').populate("rectifiedBy")
  
      return res.status(200).json({
        message: "Pending issues fetched successfully",
        issues,
      });
    } catch (error) {
      console.error("Error fetching issues:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }
  
