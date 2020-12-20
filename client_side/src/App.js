import React, { useState, useEffect } from 'react';
import personService from './services/server';
import { Grid, Button, TextField } from '@material-ui/core';
import './App.css';
import Logo from './images/PhoneBook-logo.svg';
import NoRecordFound from './images/NoRecordFound.svg';
import { Pagination } from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchName, setSearchName] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null);
  const [personsToShow, setPersonToShow] = useState([]);
  const [showGOBackBtn, setShowGoBackBtn] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateName, setUpdateName] = useState('');
  const [updatePhone, setUpdatePhone] = useState('');
  const [updateID, setUpdateID] = useState('');
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [noOfPages, setNoPage] = useState(1);

  useEffect(() => {
    // console.log('effect')
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled--> ', response)
        setPersons(response.data);
        setPersonToShow(response.data);
      })
  }, [])

  useEffect(() => {
    setNoPage(Math.ceil(personsToShow.length / itemsPerPage));
  }, [personsToShow])


  const addNewName = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const addNewPhone = (event) => {
    // console.log(event.target.value)
    setNewPhone(event.target.value)
  }

  const addUpdatePhone = (event) => {
    setUpdatePhone(event.target.value);
  }

  const handleFilterNameChange = (event) => {
    // console.log(event.target.value)
    setSearchName(event.target.value)
  }

  const handleUpdate = () => {
    const newobj = { name: updateName, number: updatePhone, id: updateID }
    updateField(updateID, newobj);
  }

  const handleUpdateClick = (item) => {
    setUpdateName(item.name);
    setUpdatePhone(item.number);
    setUpdateID(item.id);
    setShowUpdate(true);
  }


  const updateField = (personID, newobj) => {
    personService
      .update(personID, newobj)
      .then(response => {
        // console.log(response)
        // setPersons(persons.map(x => x.id !== personID ? x : response.data));
        // setPersonToShow(persons.map(x => x.id !== personID ? x : response.data));
        setPersons(response.data);
        setPersonToShow(response.data);
        setShowUpdate(false);
        setErrorMessage('Successfully Updated')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const addField = (event) => {
    event.preventDefault()

    //if(persons.includes({newName})){
    //  alert(`${newName} is already added to phonebook`)
    //}

    if (newName === '' || newPhone === '') {
      setErrorMessage('Please Enter Name and Phone Number')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    else {
      let personID = 0
      if (persons.some(value => {
        personID = value.id
        return value.name === newName
      })) {
        if (window.confirm(`${newName} is already added to phonebook , replace the old number with a new one?`)) {
          const newobj = { name: newName, number: newPhone, id: personID }
          updateField(personID, newobj);
        }
      }
      else {
        const newPerson = { name: newName, number: newPhone, id: persons.length + 1 }
        setPersons(persons.concat(newPerson));
        setPersonToShow(persons.concat(newPerson));
        personService
          .create(newPerson)
          .then(response => {
            // console.log(response)
            setErrorMessage('Successfully Added')
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)

          })
      }
      setNewName('')
      setNewPhone('')
    }
  }

  const deleteField = (props) => {
    if (window.confirm('Delete ' + props.name + ' ? ')) {
      personService
        .deleteEntry(props.id)
        .then(response => {
          // console.log(response)
          setPersons(persons.filter(n => n.id !== props.id))
          setPersonToShow(persons.filter(n => n.id !== props.id))
          setErrorMessage('Successfully Deleted')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)

        })
    }

  }

  const handlePageChange = (event, value) => {
    setPage(value);
  }

  const handleSearchChange = () => {
    // console.log("inside search field--> ", searchName)

    if (searchName) {
      setShowGoBackBtn(true);
      //insensitive case search
      setPersonToShow(persons.filter(person => person.name.search(new RegExp(searchName, "i")) !== -1))
    } else {
      setPersonToShow(persons);
    }
  }

  const handleGoBack = () => {
    setPersonToShow(persons);
    // setSearchName(null);
    setShowGoBackBtn(false);
  }

  return (
    <Grid>
      { errorMessage ?
        <div className="error">
          {errorMessage}
        </div>
        : ''
      }
      <Grid item container xs={12} className="outer-div">

        <Grid item container xs={12} md={6} className="left-container">
          <h1>PhoneBook</h1>
          <img src={Logo} alt="logo"></img>
        </Grid>
        <Grid item container xs={12} md={6} className="right-container">
          <Grid item container xs={12} spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField id="outlined-basic3" label="Search" onChange={handleFilterNameChange} variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="contained" onClick={handleSearchChange} color="secondary" size="large" className="searchBtn">Search</Button>
            </Grid>
            {
              showGOBackBtn ?
                <Grid item xs={12} md={2}>
                  <Button variant="contained" onClick={handleGoBack} color="secondary" size="large" className="searchBtn">Go Back</Button>
                </Grid>
                : ''
            }
          </Grid>

          <Grid item container xs={12} spacing={2} style={{ marginTop: '25px' }}>
            <Grid item xs={12} md={5}>
              <TextField id="outlined-basic1" value={newName} onChange={addNewName} label="Name" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField id="outlined-basic2" value={newPhone} onChange={addNewPhone} label="Number" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="contained" onClick={addField} color="secondary" size="large" className="searchBtn">ADD</Button>
            </Grid>
          </Grid>

          {showUpdate ?
            <Grid item container xs={12} spacing={2} style={{ marginTop: '25px' }}>
              <Grid item xs={12} md={5}>
                <TextField id="outlined-basic1" value={updateName} label="Name" variant="outlined" fullWidth />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField id="outlined-basic2" value={updatePhone} onChange={addUpdatePhone} label="Number" variant="outlined" fullWidth />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button variant="contained" onClick={handleUpdate} color="secondary" size="large" className="searchBtn">UPDATE</Button>
              </Grid>
            </Grid>
            :
            ''}

          {
            personsToShow.length > 0 ?

              <Grid item container xs={12} style={{ marginTop: '25px' }}>
                <Grid item md={4} xs={6}>
                  <h2>Name</h2>
                </Grid>
                <Grid item md={4} xs={6}>
                  <h2>Number</h2>
                </Grid>
                <hr ></hr>
              </Grid>
              :
              ''
          }

          {
            personsToShow.length > 0 ?
              personsToShow.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item) => (
                // personsToShow.map((item) => (
                <Grid item container xs={12} key={item.id}>
                  <Grid item container xs={12}>
                    <Grid item xs={6} md={4}><p>{item.name}</p></Grid>
                    <Grid item xs={6} md={4}><p>{item.number}</p></Grid>
                    <Grid item xs={6} md={2} style={{ marginTop: '20px' }} >
                      <Button variant="contained" onClick={() => deleteField(item)} color="secondary" size="large" className="searchBtn">DELETE</Button>
                    </Grid>
                    <Grid item xs={6} md={2} style={{ marginTop: '20px' }}>
                      <Button variant="contained" onClick={() => handleUpdateClick(item)} color="secondary" size="large" className="searchBtn">UPDATE</Button>
                    </Grid>
                  </Grid>
                  <hr ></hr>
                </Grid>
              ))
              :
              <img src={NoRecordFound} alt="No Data"></img>
          }

          <Pagination
            count={noOfPages}
            page={page}
            onChange={handlePageChange}
            defaultPage={1}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />

        </Grid>
      </Grid>

      <Grid item container xs={12} className="footerGrid">
        <h4> Made with <span role="img" aria-label="heart"> &#10084;</span> by Anuradha Aggarwal </h4>
        <Grid item container xs={12} className="footerGrid" >
          <a href="https://github.com/anuradha9712"  ><FontAwesomeIcon icon={faGithub} /></a>
          <a href="https://www.linkedin.com/in/anuradha-aggarwal-4a2751107/"><FontAwesomeIcon icon={faLinkedin} /></a>
          <a href="https://twitter.com/Anuradh06359394/"><FontAwesomeIcon icon={faTwitter} /></a>
        </Grid>
      </Grid>

    </Grid>
  )

}

export default App;
