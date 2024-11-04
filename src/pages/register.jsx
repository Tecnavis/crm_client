import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput
} from 'mdb-react-ui-kit';
import './style.css'; 
import { createCustomer } from '../components/handle_api';
import { useForm } from '../components/useForm';


function App() {
  const [values,handleChange]=useForm({
    name:'',
    shopname:'',
    address:'',
    email:'',
    phone:'',
    password:''
  })
  return (
    <MDBContainer fluid className="d-flex justify-content-center align-items-center custom-container">
      <MDBCard className='mx-3 mb-5 p-4 shadow-5 custom-card'>
        <MDBCardBody className='p-4 text-center'>

          <h2 className="fw-bold mb-5">Sign up now</h2>

          <MDBRow>
            <MDBCol md='6'>
              <MDBInput wrapperClass='mb-4' placeholder='Your Name' id='form1' type='text' name='name' onChange={handleChange} value={values.name} required='required' />
            </MDBCol>

            <MDBCol md='6'>
              <MDBInput wrapperClass='mb-4' placeholder='Shop Name' id='form2' type='text' name='shopname' onChange={handleChange} value={values.shopname} required='required' />
            </MDBCol>
          </MDBRow>

          <MDBInput wrapperClass='mb-4' placeholder='Address' id='form3' type='text' name='address' onChange={handleChange} value={values.address} required='required' />
          <MDBInput wrapperClass='mb-4' placeholder='Email' id='form4' type='email' name='email' onChange={handleChange} value={values.email} required='required' />
          <MDBInput wrapperClass='mb-4' placeholder='Phone' id='form5' type='number' name='phone' onChange={handleChange} value={values.phone} required='required' />
          <MDBInput wrapperClass='mb-4' placeholder='Password' id='form6' type='password' name='password' onChange={handleChange} value={values.password} required='required' />

          <button className='btn-1'  onClick={() => createCustomer(values)}>Sign up</button>
          <br/>
          <div className="d-flex justify-content-between mb-4">
            <a href="/" className="small">Already signed in?</a>
          </div>

        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default App;
