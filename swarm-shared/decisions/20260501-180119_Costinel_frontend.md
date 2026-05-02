# Costinel / frontend

### Final Proposal for Enhancing the Costinel Platform

#### Diagnosis
The Costinel platform currently faces several critical issues that hinder effective cost management:
- **Lack of Real-Time Dashboard**: Users struggle to identify areas of inefficiency due to the absence of a robust real-time cost dashboard with interactive visualizations.
- **Limited Drill-Down Capabilities**: The existing cost analytics features do not allow users to drill down into specific services, regions, or accounts, making it difficult to investigate cost anomalies.
- **Inadequate Cost Forecasting**: There is no clear display of cost forecasting and prediction data, complicating users' ability to anticipate future expenses.
- **Poor User Interface**: The platform's user interface is not intuitive, leading to a suboptimal user experience when navigating between features.
- **Non-Interactive Visualizations**: Current visualizations, including cost heatmaps, lack interactivity, limiting users' ability to explore and analyze cost data in detail.

#### Proposed Changes
To address these issues, we propose a comprehensive enhancement of the cost dashboard, focusing on interactive visualizations and improved user navigation. The key changes will include:

1. **Real-Time Cost Dashboard**: Develop a new dashboard that provides real-time insights into cost data with interactive visualizations.
2. **Drill-Down Functionality**: Implement drill-down capabilities that allow users to click on specific data points to view more detailed information.
3. **Cost Forecasting Display**: Integrate a section that clearly presents cost forecasting and prediction data.
4. **User-Friendly Interface**: Redesign the user interface to ensure intuitive navigation and accessibility of features.
5. **Interactive Heatmaps**: Enhance heatmap visualizations to be interactive, allowing users to explore cost data dynamically.

#### Implementation Steps
1. **Install Visualization Libraries**:
   - Run the following command to install necessary libraries:
     ```bash
     npm install react-chartjs-2 chart.js
     ```

2. **Create Cost Dashboard Component**:
   - Develop a new component for the cost dashboard that includes interactive visualizations and drill-down features:
   ```jsx
   // src/components/CostDashboard.js
   import React, { useState, useEffect } from 'react';
   import { Line } from 'react-chartjs-2';
   import api from '../utils/api';

   const CostDashboard = () => {
     const [costData, setCostData] = useState([]);
     const [selectedService, setSelectedService] = useState(null);

     useEffect(() => {
       fetchCostData();
     }, []);

     const fetchCostData = async () => {
       const response = await api.getCostData();
       setCostData(response.data);
     };

     const handleServiceClick = (service) => {
       setSelectedService(service);
     };

     return (
       <div>
         <Line
           data={{
             labels: costData.map(data => data.date),
             datasets: [{
               label: 'Cost',
               data: costData.map(data => data.cost),
               backgroundColor: 'rgba(255, 99, 132, 0.2)',
               borderColor: 'rgba(255, 99, 132, 1)',
               borderWidth: 1,
             }],
           }}
           options={{
             title: { display: true, text: 'Cost Over Time' },
             scales: {
               yAxes: [{ scaleLabel: { display: true, labelString: 'Cost' } }],
               xAxes: [{ scaleLabel: { display: true, labelString: 'Date' } }],
             },
           }}
         />
         <ul>
           {costData.map(service => (
             <li key={service.id} onClick={() => handleServiceClick(service)}>
               {service.name}
             </li>
           ))}
         </ul>
         {selectedService && (
           <div>
             {/* Render detailed data for selected service */}
           </div>
         )}
       </div>
     );
   };

   export default CostDashboard;
   ```

3. **Update API Utility**:
   - Enhance the API utility to include endpoints for fetching detailed cost data:
   ```javascript
   // src/utils/api.js
   import axios from 'axios';

   const api = axios.create({ baseURL: 'https://api.example.com' });

   const getCostData = async () => {
     const response = await api.get('/cost/data');
     return response.data;
   };

   const getDetailedCostData = async (serviceId) => {
     const response = await api.get(`/cost/data/detailed/${serviceId}`);
     return response.data;
   };

   export default { getCostData, getDetailedCostData };
   ```

4. **Testing and Verification**:
   - To ensure the implementation works as intended, follow these steps:
     1. Start the application using `npm start`.
     2. Navigate to the cost dashboard and verify that the interactive visualization displays correctly.
     3. Click on a service to test the drill-down functionality and ensure detailed data is displayed accurately.
     4. Use developer tools to confirm that API calls are functioning as expected.

By implementing these enhancements, the Costinel platform will provide users with a powerful tool for managing costs effectively, improving both usability and analytical capabilities.
