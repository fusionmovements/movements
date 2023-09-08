import React,{useState,useEffect} from "react";
import ExerciseDataService from "../services/exercises.js"

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';


const ExercisesList = props => {
    const [exercises,setExercises]=useState([])
    const [searchName,setSearchName]=useState("")
    const [groups,setGroups]=useState(["All Groups"])
    const [equipments,setEquipments]=useState([])
    

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j]; 
        a[j] = x;
        }
        return a;
    }

useEffect(()=>{
    retrieveGroups()
    retrieveEquipments()
},[])

const retrieveExercises = () => {//for findByGroup
    ExerciseDataService.getAll().then(response=>{
        setExercises(response.data.exercises)
    }).catch(e=>{console.log(e)})
}

//get all groups
const retrieveGroups = () => {
    ExerciseDataService.getGroups()
    .then(response=>{
    setGroups(response.data)
    console.log(response.data)
})
    .catch(e=>{console.log(e)
    })
}

//get all equipments
const retrieveEquipments = () => {
    ExerciseDataService.getEquipments()
    .then(response=>{
 
    setEquipments(response.data.filter(equipment => equipment.trim() !== ''))
    //console.log(response.data)
})
    .catch(e=>{console.log(e)
    })
}

//syncs the name with the form field 
const onChangeSearchName = e => {
    const searchName = e.target.value
    setSearchName(searchName);
}

const find = (query,by)=>{
    ExerciseDataService.find(query,by)
    .then(res => {
        console.log(res.data)
        setExercises(res.data.exercises)
        console.log(exercises)
    }).catch(e=>{
        console.log(e)
    })
}

const find2 = (query1,by1,query2,by2)=>{
    ExerciseDataService.find2(query1,by1,query2,by2)
    .then(res => {
        console.log(res.data)
        setExercises(res.data.exercises)
        console.log(exercises)
    }).catch(e=>{
        console.log(e)
    })
}

const findByName = () => {
    find(searchName,"name")
}

        const findByGroupEquipmentArray = () => {
            if(selectedGroups === "All Groups"){
                retrieveExercises()
            }
            else{
                find2(selectedGroups,"groups",selectedEquipments,"equipments")
            }
        }
  

    const [selectedGroups, setSelectedGroups] = useState([]);

    const handleGroupToggle = (group) => {
        if (selectedGroups.includes(group)) {
            setSelectedGroups(selectedGroups.filter(selectedGroup => selectedGroup !== group));
        } else {
            setSelectedGroups([...selectedGroups, group]);
        }
    }

//Choice Chip Equipment
const [selectedEquipments, setSelectedEquipments] = useState([]);


const handleEquipmentToggle = (equipment) => {
    if (selectedEquipments.includes(equipment)) {
        setSelectedEquipments(selectedEquipments.filter(selectedEquipment => selectedEquipment !== equipment));
    } else {
        setSelectedEquipments([...selectedEquipments, equipment]);
    }
};

return(
    <div>
        <Container>
            <Form>
                <Row>
                    <Col>
                    <Form.Group>
                        <Form.Control
                        type="text"
                        placeholder="Search by name"
                        value = {searchName}
                        onChange={onChangeSearchName}/>
                    </Form.Group>
                    <p></p>
                        <Button
                        className="my-button"
                        variant="primary"
                        type="button"
                        onClick={findByName}>
                            Search
                        </Button>
                    </Col>
                    <Col>
                    {/* Dropdown Groups */}
                     {/* <Form.Group>
                        <Form.Control
                        as="select"
                        onChange={onChangeSearchGroup}>
                            {groups.map(group =>{
                                return(
                                    <option value={group}>{group}</option>
                                )
                            })}
                                </Form.Control>
                                </Form.Group> */}
                                    
                                {/* <Button
                                    variant="primary"
                                    type="button"
                                    onClick={findByGroup}
                                >
                                Search
                                </Button> */}
                    </Col>
                </Row>
            </Form>
            <p></p>
            <Row>
            <Col>
      <ButtonGroup>
        {groups.map(group => (
          <Button
          className="my-button"
            key={group}
            type="checkbox"
            variant={selectedGroups.includes(group) ? 'warning' : 'outline-warning'}
            value={group}
            onClick={() => {
                handleGroupToggle(group);
                
              }}
            >
            {group}
          </Button>
        ))}
      </ButtonGroup>
      
      {/* <p>Selected Groups: {selectedGroups.join(', ')}</p> */}
            </Col>
            </Row>
{/* Choice Chips Equipments */}
<p></p>
            <Row>
            <Col>
            <ButtonGroup>
                {equipments.map(equipment => (
                    <Button
                    classname="my-button"
                    key={equipment}
                    type="checkbox"
                    variant={selectedEquipments.includes(equipment) ? 'primary' : 'outline-primary'}
                    value={equipment}

                    onClick={() => {
                        handleEquipmentToggle(equipment);
                        
                      }}>
                        {equipment}
                    </Button>
                ))}
            </ButtonGroup>
            </Col>
            </Row>
                        <p></p>
<Row>
                                <Col>
                                    <Button
                                    variant="primary"
                                    type="button"
                                    onClick = { () =>{
                                        findByGroupEquipmentArray()
                                    }}>
                                    Search
                                    </Button>
                </Col>
     <p></p>
     <Col>
<Button
  variant="primary"
  type="button"
  onClick={() => {
    const shuffled = shuffle([...exercises]); // Create a shuffled copy of the exercises
    setExercises(shuffled); // Update the state with the shuffled exercises
  }}
>
  Shuffle!
</Button>
</Col>
</Row>
<p></p>
            <Row>
                {exercises.map((exercise) => (
          <Col key={exercise._id}>
                        <Card style={{width:'18rem'}}>
                            {/* <Card.Img src={exercise.poster+"/100px180"} /> */}
                            <Card.Body>
                                <Card.Title>{exercise.name}</Card.Title>
                                <Card.Text>
                                    {exercise.group.join(', ')}
                                    <br></br>
                                    {exercise.equipment.join(' or ')}
                                </Card.Text>
                                {/* <Card.Text>{exercise.plot}</Card.Text> */}
                                {/* <Link to ={"/exercises/"+exercise._id}>View Reviews</Link> */}
                            </Card.Body>
                        </Card>
                        </Col>
                    ))
                }
            </Row>

        </Container>
    </div>
);
}

export default ExercisesList;