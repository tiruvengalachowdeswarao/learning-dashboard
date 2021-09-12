import './App.css';
import people from './people.jpg';
import compliance from './compliance.jpg';
import noncompliance from './noncompliance.jpg';
import React from 'react';
import {Tab,Nav,Row,Col,Container,Form,Button,Card,Modal,Table,Alert} from "react-bootstrap";
import { BsHouseDoorFill,BsFillGridFill } from "react-icons/bs";
import * as XLSX from "xlsx";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      setShowViewEmployeeDetails:false,
      setShowViewEmployeeComplianceDetails:false,
      setShowViewEmployeeNonComplianceDetails:false,
      setShowFileUploadSuccessMessage:false,
      setShowFileUploadErrorMessage:false,
      displayCoursedetails:false,
      dashBoardSuccess:false,
      dashBoardErrored:false,
      disable: true,
      disableGeneratebutton:true,
      complianceCourses:["Security essentials"],
      fileData: [],
      data:[],
      compliance:[],
      noncompliance:[],
      selectedEmployeeLearnings:[]
    }
  }
  onSubmit = (event) =>{
    event.preventDefault();
    let temp=[];
    for(var i= 0;i < this.state.fileData.length;i++)
    {
      let tempobj={
        Name:'',
        CourseName:[],
        EmployeeID:''
      };
      if(temp.length === 0)
      {
        tempobj.Name=this.state.fileData[i].Name;
        tempobj.CourseName=[this.state.fileData[i].CourseName];
        tempobj.EmployeeID=this.state.fileData[i].EmployeeID;
        temp=[...temp,tempobj];
      }
      else if(temp.length > 0)
      {
        var addData = false;
        for(var index=0;index<temp.length;index++)
        {
          if(temp[index].EmployeeID === this.state.fileData[i].EmployeeID)
          {
            temp[index].CourseName = [...temp[index].CourseName,this.state.fileData[i].CourseName];
            addData = false;
            break;
          }
          else{
            addData = true;
          }
        }

        if(addData)
        {
          tempobj.Name=this.state.fileData[i].Name;
          tempobj.CourseName=[this.state.fileData[i].CourseName];
          tempobj.EmployeeID=this.state.fileData[i].EmployeeID;
          temp=[...temp,tempobj];
        }
      }
    }
    let complianceEmployees=[];
    let noncomplianceEmployees=[];
    let complianceCourseCount = this.state.complianceCourses.length;
    
    for(var ind=0;ind<temp.length;ind++)
    { 
      let employeeComplianceCourseCount = 0;
      for(var complianceCoursesIndex= 0;complianceCoursesIndex < this.state.complianceCourses.length;complianceCoursesIndex++)
      {    
        for(var tempCourseIndex=0;tempCourseIndex<temp[ind].CourseName.length;tempCourseIndex++){
          if(this.state.complianceCourses[complianceCoursesIndex] === temp[ind].CourseName[tempCourseIndex])
          {
            employeeComplianceCourseCount++;
          }
        }
      }
      if(employeeComplianceCourseCount === complianceCourseCount)
      {
        complianceEmployees = [...complianceEmployees,temp[ind]];
      }
      else{
        noncomplianceEmployees = [...noncomplianceEmployees,temp[ind]];
      }
    }
    let dashboardsuccessMessage = false;
    let dashboardErrorMessage = false;
    if(temp.length > 0 && (complianceEmployees.length > 0 || noncomplianceEmployees.length > 0))
    {
      dashboardsuccessMessage=true;
    }
    else{
      dashboardErrorMessage=false;
    }

    this.setState({
      ...this.state,
      data:temp,
      disable:false,
      compliance:complianceEmployees,
      noncompliance:noncomplianceEmployees,
      dashBoardSuccess:dashboardsuccessMessage,
      dashBoardErrored:dashboardErrorMessage
    });
  }

  readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        this.setState({
          ...this.state,
          setShowFileUploadErrorMessage:true,
        });
        reject(error);
      };
    });

    promise.then((d) => {
      this.setState(
        {
          fileData:d,
          setShowFileUploadSuccessMessage:true,
          disableGeneratebutton:false
        }
    )
    });
  };

  viewEmployeeDetails =() => {
    this.setState({
      ...this.state,
      setShowViewEmployeeDetails:true,
    });
  }

  hideViewEmployeeDetails =() => {
    this.setState({
      ...this.state,
      setShowViewEmployeeDetails:false,
    });
  }

  viewEmployeeCourseDetails =() => {
    this.setState({
      ...this.state,
      displayCoursedetails:true,
    });
  }

  hideEmployeeCourseDetails =() => {
    this.setState({
      ...this.state,
      displayCoursedetails:false,
    });
  }

  ViewEmployeeComplianceDetails =() => {
    this.setState({
      ...this.state,
      setShowViewEmployeeComplianceDetails:true,
    });
  }

  hideEmployeeComplianceDetails =() => {
    this.setState({
      ...this.state,
      setShowViewEmployeeComplianceDetails:false,
    });
  }

  ViewEmployeeNonComplianceDetails =() => {
    this.setState({
      ...this.state,
      setShowViewEmployeeNonComplianceDetails:true,
    });
  }

  hideEmployeeNonComplianceDetails =() => {
    this.setState({
      ...this.state,
      setShowViewEmployeeNonComplianceDetails:false,
    });
  }

  hideFileUploadSuccessMessage =() => {
    this.setState({
      ...this.state,
      setShowFileUploadSuccessMessage:false,
    });
  }

  hideFileUploadErrorMessage=()=>{
    this.setState({
      ...this.state,
      setShowFileUploadErrorMessage:false,
    });
  }

  coursedetails=(learnings)=>{
    this.setState({
      ...this.state,
      displayCoursedetails:true,
      selectedEmployeeLearnings:learnings
    });
  }

  render ()
  {
    let employeeDetailsTableBody=this.state.data.map((obj,index)=>{
      return(
        <tr key={index}>
          <td key={index}>{index+1}</td>
          <td key={index}>{obj.EmployeeID}</td>
          <td key={index}>{obj.Name}</td>
        </tr>
      )
    });

    let employeeCourseDetailsTableBody=this.state.data.map((obj,index)=>{
      return(
         <tr key={index} onClick={()=>{this.coursedetails(obj.CourseName)}}>
          <td key={index}>{index+1}</td>
          <td key={index}>{obj.EmployeeID}</td>
          <td key={index}>{obj.Name}</td>
        </tr>
      )
    });
    let employeeCourseDetails='';
    if(this.state.displayCoursedetails)
    {
      employeeCourseDetails=this.state.selectedEmployeeLearnings.map((obj,index)=>{
        return(
           <tr key={index}>
            <td key={index}>{index+1}</td>
            <td key={index}>{obj}</td>
          </tr>
        )
      });
    }

    let employeeComplianceDetailsTableBody=this.state.compliance.map((obj,index)=>{
      return(
        <tr key={index}>
          <td key={index}>{index+1}</td>
          <td key={index}>{obj.EmployeeID}</td>
          <td key={index}>{obj.Name}</td>
        </tr>
      )
    });

    let employeeNonComplianceDetailsTableBody=this.state.noncompliance.map((obj,index)=>{
      return(
        <tr key={index}>
          <td key={index}>{index+1}</td>
          <td key={index}>{obj.EmployeeID}</td>
          <td key={index}>{obj.Name}</td>
        </tr>
      )
    });
    let dashboardMessage = '';
    if(this.state.dashBoardSuccess)
    {
      dashboardMessage=(
        <Alert variant='success' style={{width:'50rem',marginLeft:'13%',textAlign:'center'}}>
          Dashboard Genarated Successfully! click on Dashboard tab to view the learning details.
      </Alert>
      )
    }
    else if(this.state.dashBoardErrored)
    {
      dashboardMessage=(
        <Alert variant='danger'>
      Dashboard Genaration failed please check uploaded file!
      </Alert>
      )
    }
    return(
      <Container fluid>
      <Tab.Container defaultActiveKey="home">
        <Row>
          <Col md={3} className="Sidebar">
            <Nav.Item>
                <br></br>
                  <h2>
                    Learning Dashboard
                  </h2>
                <br></br>
              </Nav.Item>
            <Nav variant="pills" className="flex-column">
            <Nav.Item>
                <Nav.Link eventKey="home">
                  <BsHouseDoorFill size="30" className="Icons"/>Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="dashboard" disabled={this.state.disable}>
                  <BsFillGridFill size="30" className="Icons"/>Dashboard
                  </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={9} className="Body">
            <Tab.Content>
            <Tab.Pane eventKey="home">
            <h2 className="Content">
              Welcome to the Learning Dashboard <br></br>
              This allows you to create a dashboard with excell sheet<br></br>
              Upload you excell sheet to view learning Dashboard
            </h2>
                <Container fluid className="Home">
                  <Form onSubmit={this.onSubmit}>
                    <Row className="justify-content-md-center">
                      <Col md="6">
                        <Form.Group className="mb-3">
                          <Form.Control type="file" 
                            onChange={(e) => {
                            const file = e.target.files[0];
                            this.readExcel(file);
                            }}/>
                        </Form.Group>
                        <Modal show={this.state.setShowFileUploadSuccessMessage} onHide={this.hideFileUploadSuccessMessage} centered style={{textAlign:'center',color:'green'}}>
                          <Modal.Body>
                            File Uploaded Successfully.<br></br>
                            Click on <b>Generate Dashboard</b> button to generate the dashboard.
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="success" onClick={this.hideFileUploadSuccessMessage}>
                              Close
                            </Button>
                          </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.setShowFileUploadErrorMessage} onHide={this.hideFileUploadErrorMessage} centered style={{textAlign:'center',color:'red'}}>
                          <Modal.Body>
                            Unable to upload the file<br></br>
                            please check the format of the file
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="danger" onClick={this.hideFileUploadErrorMessage}>
                              Close
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </Col>
                    </Row>
                    <br></br>
                    <Row className="justify-content-md-center">
                      <Col md="3">
                        <Button variant="success" type="submit" disabled={this.state.disableGeneratebutton}>
                          Generate Dashboard
                        </Button>
                      </Col>
                    </Row>
                  </Form>  
                  <br></br>
                  <br></br>
                  {dashboardMessage}   
                </Container>
              </Tab.Pane>
              <Tab.Pane eventKey="dashboard">
                <Container>
                  <div className="DashBoard">
                    <Row>
                      <Col md="4">
                        <Card style={{ width: '20rem' }} bg='light'>
                          <Card.Img variant="top" style={{ height: '8rem' }} src={people} size="20"/>
                          <Card.Body>
                            <Card.Title>Employee Count</Card.Title>
                            <Card.Text>
                            <h2>{this.state.data.length}</h2>
                            </Card.Text>
                            <Button variant="link" onClick={this.viewEmployeeDetails}>View Employee Details</Button>
                          </Card.Body>
                        </Card>
                        <Modal show={this.state.setShowViewEmployeeDetails} onHide={this.hideViewEmployeeDetails} centered>
                          <Modal.Header closeButton>
                            <Modal.Title>Employee Details</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="ModalTable">
                              <Table bordered hover style={{ margin: '0px' }}>
                                <thead>
                                  <tr>
                                    <th>S NO</th>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {employeeDetailsTableBody}
                                </tbody>
                              </Table> 
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={this.hideViewEmployeeDetails}>
                              Close
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </Col>

                      <Col md="4">
                        <Card style={{ width: '20rem' }} bg='light'>
                          <Card.Img variant="top" style={{ height: '8rem' }} src={compliance} size="20"/>
                          <Card.Body>
                            <Card.Title>Security compliance</Card.Title>
                            <Card.Text>
                            <h2>{this.state.compliance.length}</h2>
                            </Card.Text>
                            <Button variant="link" onClick={this.ViewEmployeeComplianceDetails}>View Details</Button>
                          </Card.Body>
                        </Card>
                        <Modal show={this.state.setShowViewEmployeeComplianceDetails} onHide={this.hideEmployeeComplianceDetails} centered>
                          <Modal.Header closeButton>
                            <Modal.Title>Employee Details</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="ModalTable">
                              <Table bordered hover style={{ margin: '0px' }}>
                                <thead>
                                  <tr>
                                    <th>S NO</th>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                  </tr>
                                </thead>
                                <tbody>{employeeComplianceDetailsTableBody}</tbody>
                              </Table> 
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={this.hideEmployeeComplianceDetails}>
                              Close
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </Col>

                      <Col md="4">
                      <Card style={{ width: '100%' }} bg='light'>
                          <Card.Img variant="top" style={{ height: '8rem' }} src={noncompliance} size="20"/>
                          <Card.Body>
                            <Card.Title>Security Non-compliance</Card.Title>
                            <Card.Text>
                            <h2>{this.state.noncompliance.length}</h2>
                            </Card.Text>
                            <Button variant="link"  onClick={this.ViewEmployeeNonComplianceDetails}>View Details</Button>
                          </Card.Body>
                        </Card>
                        <Modal show={this.state.setShowViewEmployeeNonComplianceDetails} onHide={this.hideEmployeeNonComplianceDetails} centered>
                          <Modal.Header closeButton>
                            <Modal.Title>Employee Details</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="ModalTable">
                              <Table bordered hover style={{ margin: '0px' }}>
                                <thead>
                                  <tr>
                                    <th>S NO</th>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                  </tr>
                                </thead>
                                <tbody>{employeeNonComplianceDetailsTableBody}</tbody>
                              </Table> 
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={this.hideEmployeeNonComplianceDetails}>
                              Close
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </Col>
                    </Row>
                  </div>
                  <div className="CourseDetails">
                  <h3>Employee Learning Details</h3>
                    <div className="CourseTable">
                      <Table bordered hover style={{ margin: '0px',textAlign:'center',backgroundColor:'white'}} >
                        <thead>
                          <tr>
                            <th>S No</th>
                            <th>Employee ID</th>
                            <th>Name</th>
                          </tr>
                        </thead>
                        <tbody>
                        {employeeCourseDetailsTableBody}
                        </tbody>
                      </Table> 
                    </div>
                  </div>
                </Container>
              </Tab.Pane>
            </Tab.Content>
            <Modal show={this.state.displayCoursedetails} onHide={this.hideEmployeeCourseDetails} centered>
              <Modal.Header closeButton>
                <Modal.Title>Employee Learning Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="ModalTable">
                  <Table bordered hover style={{ margin: '0px' }}>
                    <thead>
                      <tr>
                        <th>S NO</th>
                        <th>Course Name</th>
                      </tr>
                    </thead>
                    <tbody>
                    {employeeCourseDetails}
                    </tbody>
                  </Table> 
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.hideEmployeeCourseDetails}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
    );
  }
}

export default App;
