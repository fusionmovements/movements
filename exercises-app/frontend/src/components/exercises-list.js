import React, { useState, useEffect } from "react";
import ExerciseDataService from "../services/exercises.js"
import "../App.css";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { useRef } from 'react';//jumping to specific element
import Collapse from 'react-bootstrap/Collapse'
import { ThreeDots } from 'react-loader-spinner'
import { Shuffle, Search } from 'lucide-react';


const ExercisesList = props => {
    const [loading, setLoading] = useState(false)

    const [exercises, setExercises] = useState([])
    const [searchName, setSearchName] = useState("")
    const [groups, setGroups] = useState(["All Groups"])
    const [equipments, setEquipments] = useState([])

    const [open, setOpen] = useState({});








    const bottomEl = useRef(null);//for Jumping to exercises bottomEl

    useEffect(() => {
        scrollToBottom();
    }, [exercises]);

    const scrollToBottom = () => {
        if (bottomEl.current) {
            bottomEl.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    //     bottomEl?.current?.scrollIntoView({ behavior: 'smooth' });
    // };

    function handleCollapse(id) {
        setOpen(prevState => ({ ...prevState, [id]: !prevState[id] }))
    }
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

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 5000)
        //retrieveExercises()
        retrieveGroups()
        retrieveEquipments()
        //scrollToBottom()
    }, [])

    const retrieveExercises = () => {//for findByGroup
        ExerciseDataService.getAll().then(response => {
            setExercises(response.data.exercises)
        }).catch(e => { console.log(e) })
    }

    //get all groups
    const retrieveGroups = () => {
        ExerciseDataService.getGroups()
            .then(response => {
                setGroups(response.data)
                console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }

    //get all equipments
    const retrieveEquipments = () => {
        ExerciseDataService.getEquipments()
            .then(response => {

                setEquipments(response.data.filter(equipment => equipment.trim() !== ''))
                //console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }

    //syncs the name with the form field 
    const onChangeSearchName = e => {
        const searchName = e.target.value
        setSearchName(searchName);
    }

    const find = (query, by) => {
        ExerciseDataService.find(query, by)
            .then(res => {
                const shuffled = shuffle([...res.data.exercises]); // Create a shuffled copy of the exercises
                setExercises(shuffled); // Update the state with the shuffled exercises
                setExercises(res.data.exercises)
            }).catch(e => {
                console.log(e)
            })
    }

    const find2 = (query1, by1, query2, by2) => {
        ExerciseDataService.find2(query1, by1, query2, by2)
            .then(res => {
                const shuffled = shuffle([...res.data.exercises]); // Create a shuffled copy of the exercises
                setExercises(shuffled); // Update the state with the shuffled exercises
                //setExercises(res.data.exercises)
            }).catch(e => {
                console.log(e)
            })
    }

    const findByName = () => {
        find(searchName, "name")
    }

    const findByGroupEquipmentArray = () => {
        if (selectedGroups === "All Groups") {
            retrieveExercises()
        }
        else {
            find2(selectedGroups, "groups", selectedEquipments, "equipments")
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

    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    return (

        <div>
            {/* <div>
      <div className="tab-buttons">
        <button
          onClick={() => handleTabClick(1)}
          className={activeTab === 1 ? "active" : ""}
        >
          Tab 1
        </button>
        <button
          onClick={() => handleTabClick(2)}
          className={activeTab === 2 ? "active" : ""}
        >
          Tab 2
        </button>
        <button
          onClick={() => handleTabClick(3)}
          className={activeTab === 3 ? "active" : ""}
        >
          Tab 3
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 1 && <div>Content for Tab 1</div>}
        {activeTab === 2 && <div>Content for Tab 2</div>}
        {activeTab === 3 && <div>Content for Tab 3</div>}
      </div>
    </div> */}


            {
                loading ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <ThreeDots color={'#1384db'} loading={loading} size={150} />
                    </div>
                    :

                    <Container>
                        <Form>
                            <Row>
                                <div className="d-grid gap-2">
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by name"
                                            value={searchName}
                                            onChange={onChangeSearchName} />
                                    </Form.Group>
                                    <Button
                                        className="my-button"
                                        variant="primary"
                                        type="button"
                                        onClick={findByName}>
                                        <Search />
                                    </Button>
                                </div>
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
                        <p></p>
                        <Row>
                            <Col>
                                {groups.map(group => (
                                    <Button
                                        className="my-button"
                                        key={group}
                                        type="checkbox"
                                        //variant={selectedGroups.includes(group) ? 'dark' : 'outline-dark'}
                                        variant={
                                            selectedGroups.length === 0
                                                ? 'outline-dark'
                                                : selectedGroups.includes(group)
                                                    ? group === 'cardio'
                                                        ? 'primary'
                                                        : group === 'leg'
                                                            ? 'secondary'
                                                            : group === 'core'
                                                                ? 'success'
                                                                : group === 'push'
                                                                    ? 'warning'
                                                                    : group === 'pull'
                                                                        ? 'danger'
                                                                        : group === 'mobility'
                                                                            ? 'info'
                                                                            : group === 'walk'
                                                                                ? 'dark'
                                                                                : 'outline-dark'
                                                    : 'outline-dark'
                                        }
                                        value={group}
                                        onClick={() => {
                                            handleGroupToggle(group);
                                        }}
                                    >
                                        {group}
                                    </Button>
                                ))}

                            </Col>
                        </Row>
                        {/* Choice Chips Equipments */}
                        <p></p>
                        <Row>
                            <Col>

                                {equipments.map(equipment => (
                                    <Button
                                        className="my-button"
                                        key={equipment}
                                        type="checkbox"
                                        variant={selectedEquipments.includes(equipment) ? 'dark' : 'outline-dark'}
                                        value={equipment}

                                        onClick={() => {
                                            handleEquipmentToggle(equipment);

                                        }}>
                                        {equipment}
                                    </Button>
                                ))}
                                {/* </ButtonGroup> */}
                            </Col>
                        </Row>
                        <p></p>
                        <Row>
                            <Col>
                                <div className="d-grid gap-2">
                                    <div ref={bottomEl}></div>
                                    <Button
                                        //class = "btn btn-default btn-block"
                                        variant="primary"
                                        type="button"
                                        onClick={() => {
                                            findByGroupEquipmentArray();
                                            //scrollToBottom();
                                        }}>
                                        <Search />
                                    </Button>
                                </div>
                            </Col>
                            <p></p>
                            <Col>
                                <div className="d-grid gap-2"
                                    sticky="top">

                                    <Button
                                        variant="outline-primary"
                                        type="button"
                                        onClick={() => {
                                            //scrollToBottom();
                                            const shuffled = shuffle([...exercises]); // Create a shuffled copy of the exercises
                                            setExercises(shuffled); // Update the state with the shuffled exercises
                                        }}
                                    >
                                        <Shuffle />
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <p></p>


                        <Row>
                            {exercises.map((exercise) => (
                                <Col key={exercise._id}>

                                    <Card
                                        className={"text-center mx-auto border-2"}
                                        border={
                                            exercise.group.includes('cardio')
                                            ? 'primary'
                                      : exercise.group.includes('leg')
                                    ? 'secondary'
                                    : exercise.group.includes('core')
                                    ? 'success'
                                    : exercise.group.includes('push')
                                    ? 'warning'
                                    : exercise.group.includes('pull')
                                    ? 'danger'
                                    : exercise.group.includes('mobility')
                                    ? 'info'
                                    : exercise.group.includes('walk')
                                    ? 'dark'
                                    : 'dark'
                                     }
                                    style={{ width: '20rem', margin: '5px' }}>

                                    {/* <Card.Img src={exercise.poster+"/100px180"} /> */}
                                    <Card.Body>
                                        <Card.Title
                                            style={{

                                            }}
                                        >{exercise.name}</Card.Title>
                                        <Card.Text>
                                            <Row>
                                                <Card.Text className="text-center">{exercise.equipment.join(' or ')}</Card.Text>

                                                <div className="border border-dark rounded-2"
                                                    onClick={() => handleCollapse(exercise._id)}>how to
                                                    <Collapse in={open[exercise._id]}>
                                                        <div key={exercise._id} id="example-collapse-text" className="collapsedText">
                                                            {exercise.howto ? (
                                                                <ul style={{ textAlign: 'left', listStyleType: 'disc', paddingLeft: '20px' }}>
                                                                    {exercise.howto.map((step, index) => (
                                                                        <li key={index}>{step}</li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p>explanation coming soon.</p>
                                                            )}
                                                        </div>
                                                    </Collapse></div>
                                            </Row>


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

            }
        </div >
    );
}

export default ExercisesList;