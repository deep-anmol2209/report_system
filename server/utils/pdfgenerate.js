import puppeteer from 'puppeteer';
import Issue from '../model/issueModel.js';
import mongoose from 'mongoose';
import { dotenvVar } from '../config.js';
import fs from 'fs';
import path from 'path';

export async function generatePDF(filters = {}) {

  mongoose.connect(dotenvVar.MONGODB_URI) // Use `process.env` for dotenv variables
    .then(() =>
        { 
            console.log("Connected to DB")
             
        }) // Arrow function to properly handle the resolved promise
    .catch(err => console.error("Database connection error:", err)); // Proper `.catch()` handling

  const { engineerId, projectId, plazaId, startDate, endDate } = filters;
 let query={};
    if (engineerId) {
      query['$or'] = [
        { reportedBy: engineerId },  // Filter by reportedBy
        { rectifiedBy: engineerId },  // Filter by rectifiedBy
      ];
    }
  
    if (projectId) {
      query['plazaId'] = projectId;  // Filter by plazaId (assuming it's project related)
    }
  
    if (plazaId) {
      console.log(plazaId);
      
      query['plazaId'] = plazaId;  // Filter specifically by plaza
    }
  
    if (startDate && endDate) {
      query['issueTime'] = { $gte: new Date(startDate), $lte: new Date(endDate) };  // Filter by date range
    }
  
    // Fetch filtered issues
    console.log(query);
    
    const issues = await Issue.find(query)
      .populate('reportedBy')
      .populate('rectifiedBy')
      .populate('plazaId');
  
    console.log("Fetched Issues:", issues.length);
  const tableRows = issues.map(issue => {
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
  }).join('');

  const html = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        h1 { text-align: center; }
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
