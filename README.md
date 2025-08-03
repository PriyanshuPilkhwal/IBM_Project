# College Admission Agent - RAG-Powered AI Assistant

A sophisticated College Admission Agent powered by IBM Granite AI model using Retrieval-Augmented Generation (RAG) technology. This application streamlines the student admission process by providing instant, accurate responses to admission-related queries.

## 🚀 Features

- **AI-Powered Responses**: Utilizes IBM Granite 3.3-8B Instruct model for intelligent responses
- **Real-time Query Processing**: Instant answers to student questions
- **Comprehensive Coverage**: Handles admission requirements, deadlines, fees, courses, and more
- **Modern UI**: Clean, responsive interface with real-time chat functionality
- **RAG Technology**: Retrieves and augments responses with relevant institutional data
- **24/7 Availability**: Always accessible for prospective students

## 🛠️ Technology Stack

- **Backend**: Python Flask with IBM Cloud Watson ML
- **Frontend**: React.js with modern CSS
- **AI Model**: IBM Granite 3.3-8B Instruct
- **Cloud**: IBM Cloud Lite Services (Mandatory as per requirements)

## 📋 Prerequisites

- Python 3.7+
- IBM Cloud Account with Watson Machine Learning service
- Valid IBM Cloud API Key

## 🔧 Installation & Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure IBM Cloud Credentials**
   - Update the credentials in `app.py`:
     - `API_KEY`: Your IBM Cloud API Key
     - `PROJECT_ID`: Your Watson ML Project ID
     - `BASE_URL`: IBM Cloud region URL

3. **Run the Application**
   ```bash
   python app.py
   ```

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:5000`
   - The frontend will load automatically

## 📁 File Structure

```
projectibm/
├── working.py                    # Original IBM Granite integration
├── app.py                       # Flask backend with API endpoints
├── college_admission_frontend.html # React frontend
├── requirements.txt             # Python dependencies
└── README.md                   # This file
```

## 🔄 API Endpoints

### Chat API
- **Endpoint**: `POST /api/chat`
- **Body**: `{"message": "Your question here"}`
- **Response**: `{"response": "AI generated response", "status": "success"}`

### Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `{"status": "healthy", "service": "College Admission Agent", "model": "ibm/granite-3-3-8b-instruct"}`

## 💬 Usage Examples

Students can ask questions like:
- "What are the admission requirements for undergraduate programs?"
- "When is the application deadline for Fall 2024?"
- "What is the fee structure for international students?"
- "Tell me about scholarship opportunities"
- "What documents do I need for application?"

## 🎯 RAG Implementation

The system implements RAG by:
1. **Retrieval**: Accessing institutional databases and admission policies
2. **Augmentation**: Enhancing queries with relevant context
3. **Generation**: Producing accurate, contextual responses using IBM Granite

## 🔧 Customization

### Adding New Topics
Update the `quickTopics` array in the frontend to add new quick-access buttons.

### Modifying AI Responses
Adjust the `admission_context` in `app.py` to customize the AI's behavior and knowledge base.

### Styling Changes
Modify the CSS in `college_admission_frontend.html` to customize the appearance.

## 🚨 Troubleshooting

### Common Issues

1. **Connection Error**
   - Verify IBM Cloud credentials
   - Check internet connectivity
   - Ensure Watson ML service is active

2. **API Rate Limits**
   - IBM Cloud Lite has usage limits
   - Monitor your usage in IBM Cloud dashboard

3. **Frontend Not Loading**
   - Ensure Flask server is running
   - Check browser console for errors

## 🌟 Benefits

- **Instant Response**: No waiting for human operators
- **24/7 Availability**: Always accessible for global students
- **Consistent Information**: Standardized, accurate responses
- **Reduced Workload**: Decreases manual inquiries to admission offices
- **Enhanced Experience**: Improves overall applicant satisfaction
- **Scalable**: Handles multiple simultaneous queries

## 📊 Performance Features

- **Real-time Processing**: Sub-second response times
- **Scalable Architecture**: Handles multiple concurrent users
- **Error Handling**: Graceful fallbacks for service interruptions
- **Status Monitoring**: Live connection status indicators

## 🔐 Security

- API key authentication with IBM Cloud
- CORS protection for web requests
- Error message sanitization
- Secure credential management

## 📈 Future Enhancements

- Integration with college databases
- Multi-language support
- Voice interaction capabilities
- Advanced analytics dashboard
- Mobile application

## 📞 Support

For technical issues or questions:
- Check IBM Cloud status page
- Review Watson ML documentation
- Contact admissions office directly for urgent queries

---

**Powered by IBM Granite AI** | **Built for Educational Excellence**
