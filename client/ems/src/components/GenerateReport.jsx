// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getallProjects } from '../features/projectSlice';
// import { fetchPlazas } from '../features/plazaSlice';
// import { fetchSiteEngineers } from "../features/siteEngineer";
// import axios from 'axios';
// import { Select, Button, DatePicker, Form, Row, Col, Input } from 'antd';


// const { Option } = Select;

// const GenerateReport = () => {
//   const [engineerId, setEngineerId] = useState('');
//   const [plazaId, setPlazaId] = useState('');
//   const [projectId, setProjectId] = useState('');
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
// const token = localStorage.getItem('token')
//   const dispatch = useDispatch();
// const apiUrl= "https://mepl-erp.co.in/api/superadmin/report/pdf"
//   // Fetch data from Redux
//   const { engineers, status, error } = useSelector((state) => state.siteEngineer)
//   const plazas = useSelector((state) => state.plaza.plazas || []);
//   const projects = useSelector((state) => state.project.projects || []);

//   // Fetch data on component mount
//   useEffect(() => {
//     dispatch(fetchSiteEngineers());
//     dispatch(fetchPlazas());
//     dispatch(getallProjects());
//   }, [dispatch]);

//   const handleGenerateReport = () => {
//     const filters = {
//       engineerId,
//       plazaId,
//       projectId,
//       startDate: startDate ? startDate.toISOString() : undefined,
//       endDate: endDate ? endDate.toISOString() : undefined,
//     };
// console.log(filters);

// axios
// .get(apiUrl, {
//   headers: {
//     Authorization: `Bearer ${token}`, // Add Authorization header with the Bearer token
//   },
//   params: filters,
//   responseType: 'blob', // Set response type to blob to download PDF
// })
//       .then((response) => {
//         const link = document.createElement('a');
//         link.href = window.URL.createObjectURL(response.data);
//         link.download = 'issues_report.pdf';
//         link.click();
//       })
//       .catch((error) => {
//         console.error('Error generating report:', error);
//       });
//   };

//   return (
//     <div className="p-6 ">
//       <h2 className="text-2xl font-semibold mb-6">Generate Report</h2>
//       <Form
//         layout="vertical"
//         onFinish={handleGenerateReport}
//         className="space-y-4"
//       >
//         <Row gutter={16}>
//           {/* Engineer Selector */}
//           <Col span={12}>
//             <Form.Item label="Engineer" name="engineerId">
//               <Select
//                 value={engineerId}
//                 onChange={(value) => setEngineerId(value)}
//                 placeholder="Select Engineer"
//               >
//                 <Option value="">None</Option>
//                 {engineers.length > 0 ? (
//                   engineers.map((engineer) => (
//                     <Option key={engineer._id} value={engineer._id}>
//                       {engineer.firstName} {engineer.lastName}
//                     </Option>
//                   ))
//                 ) : (
//                   <Option disabled>No Engineers Available</Option>
//                 )}
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Plaza Selector */}
//           <Col span={12}>
//             <Form.Item label="Plaza" name="plazaId">
//               <Select
//                 value={plazaId}
//                 onChange={(value) => setPlazaId(value)}
//                 placeholder="Select Plaza"
//               >
//                 <Option value="">None</Option>
//                 {plazas.length > 0 ? (
//                   plazas.map((plaza) => (
//                     <Option key={plaza._id} value={plaza._id}>
//                       {plaza.plazaName}
//                     </Option>
//                   ))
//                 ) : (
//                   <Option disabled>No Plazas Available</Option>
//                 )}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           {/* Project Selector */}
//           <Col span={12}>
//             <Form.Item label="Project" name="projectId">
//               <Select
//                 value={projectId}
//                 onChange={(value) => setProjectId(value)}
//                 placeholder="Select Project"
//               >
//                 <Option value="">None</Option>
//                 {projects.length > 0 ? (
//                   projects.map((project) => (
//                     <Option key={project._id} value={project._id}>
//                       {project.projectName}
//                     </Option>
//                   ))
//                 ) : (
//                   <Option disabled>No Projects Available</Option>
//                 )}
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Start Date Selector */}
//           <Col span={12}>
//             <Form.Item label="Start Date" name="startDate">
//               <DatePicker
//                 style={{ width: '100%' }}
//                 value={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 placeholder="Select Start Date"
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           {/* End Date Selector */}
//           <Col span={12}>
//             <Form.Item label="End Date" name="endDate">
//               <DatePicker
//                 style={{ width: '100%' }}
//                 value={endDate}
//                 onChange={(date) => setEndDate(date)}
//                 placeholder="Select End Date"
//               />
//             </Form.Item>
//           </Col>

//           {/* Empty column for spacing */}
//           <Col span={12}></Col>
//         </Row>

//         {/* Generate Report Button */}
//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             block
//             className="bg-blue-500 text-white"
//           >
//             Generate Report
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default GenerateReport;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getallProjects } from '../features/projectSlice';
import { fetchPlazas } from '../features/plazaSlice';
import {fetchSiteEngineers} from "../features/siteEngineer"
import axios from 'axios';
import { Select, Button, DatePicker, Form, Row, Col } from 'antd';

const { Option } = Select;

const GenerateReport = () => {
  const [engineerId, setEngineerId] = useState('');
  const [plazaId, setPlazaId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const apiUrl = "https://mepl-erp.co.in/api/superadmin/report/pdf";

  const { engineers } = useSelector((state) => state.siteEngineer);
  const plazas = useSelector((state) => state.plaza.plazas || []);
  const projects = useSelector((state) => state.project.projects || []);

  useEffect(() => {
    dispatch(fetchSiteEngineers());
    dispatch(fetchPlazas());
    dispatch(getallProjects());
  }, [dispatch]);

  const handleGenerateReport = () => {
    const filters = {
      engineerId,
      plazaId,
      projectId,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      
    };

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'issues_report.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error generating report:', error);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Generate Report</h2>
      <Form layout="vertical" onFinish={handleGenerateReport}>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Engineer" name="engineerId">
              <Select
                value={engineerId}
                onChange={(value) => setEngineerId(value)}
                placeholder="Select Engineer"
                allowClear
              >
                <Option value="">None</Option>
                {engineers.map((engineer) => (
                  <Option key={engineer._id} value={engineer._id}>
                    {engineer.firstName} {engineer.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Plaza" name="plazaId">
              <Select
                value={plazaId}
                onChange={(value) => setPlazaId(value)}
                placeholder="Select Plaza"
                allowClear
              >
                <Option value="">None</Option>
                {plazas.map((plaza) => (
                  <Option key={plaza._id} value={plaza._id}>
                    {plaza.plazaName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Project" name="projectId">
              <Select
                value={projectId}
                onChange={(value) => setProjectId(value)}
                placeholder="Select Project"
                allowClear
              >
                <Option value="">None</Option>
                {projects.map((project) => (
                  <Option key={project._id} value={project._id}>
                    {project.projectName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Start Date & Time" name="startDate">
              <DatePicker
                style={{ width: '100%' }}
                showTime
                value={startDate}
                onChange={(date) => setStartDate(date)}
                placeholder="Select Start Date & Time"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="End Date & Time" name="endDate">
              <DatePicker
                style={{ width: '100%' }}
                showTime
                value={endDate}
                onChange={(date) => setEndDate(date)}
                placeholder="Select End Date & Time"
              />
            </Form.Item>
          </Col>

          <Col span={12}></Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Generate Report
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GenerateReport;