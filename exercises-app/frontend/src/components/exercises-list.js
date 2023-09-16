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
import { Shuffle, Search, Settings } from 'lucide-react';
import { shuffle, scrollToBottom } from "./features"

const ExercisesList = props => {
    const [loading, setLoading] = useState(false)
    const buttonRef = useRef(null)
    function handleClickBlur(){
        buttonRef.current.blur()
    }

    const [exercises, setExercises] = useState([])
    const [searchName, setSearchName] = useState("")
    const [groups, setGroups] = useState(["All Groups"])
    const [equipments, setEquipments] = useState([])

    const [open, setOpen] = useState({});//collapse
    const [selectedLevels, setSelectedLevels] = useState([2])
    const levels = [1, 2, 3, 4]
    const [count, setCount] = useState(5);

    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    }

    const handleLevelClick = (levelNumber) => {
        if (!(selectedLevels.includes(levelNumber))) {
            setSelectedLevels([...selectedLevels, levelNumber])
            console.log("Länge: ", selectedLevels.length)
        } else {
            if (selectedLevels.length >= 2) {
                console.log("Länge: ", selectedLevels.length)
                setSelectedLevels(selectedLevels.filter(selectedLevel => selectedLevel !== levelNumber))
            } else { console.log("Länge: ", selectedLevels.length) }
        }
    }

    const handleIncrement = () => {
        if (count < 30) {
            setCount(count + 1);
        }
    };

    const handleDecrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    //for Jumping to exercises bottomEl
    const bottomEl = useRef(null);
    useEffect(() => {
        scrollToBottom(bottomEl);
    }, [exercises]);



    function handleCollapse(id) {
        setOpen(prevState => ({ ...prevState, [id]: !prevState[id] }))
    }

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 5000)
        retrieveGroups()
        retrieveEquipments()
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

    // const find2 = (query1, by1, query2, by2) => {
    //     ExerciseDataService.find2(query1, by1, query2, by2)
    //         .then(res => {
    //             const shuffled = shuffle([...res.data.exercises]); // Create a shuffled copy of the exercises
    //             setExercises(shuffled); // Update the state with the shuffled exercises
    //             //setExercises(res.data.exercises)
    //         }).catch(e => {
    //             console.log(e)
    //         })
    // }

    const find3 = (query1, by1, query2, by2, query3, by3) => {
        ExerciseDataService.find3(query1, by1, query2, by2, query3, by3, count)
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
            find3(selectedGroups, "groups", selectedEquipments, "equipments", selectedLevels, "levels")
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
    const [selectedEquipments, setSelectedEquipments] = useState(["none"]);


    const handleEquipmentToggle = (equipment) => {
        if (selectedEquipments.includes(equipment)) {
            setSelectedEquipments(selectedEquipments.filter(selectedEquipment => selectedEquipment !== equipment));
        } else {
            setSelectedEquipments([...selectedEquipments, equipment]);
        }
    };

    return (

        <div>
            {
                loading ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <ThreeDots color={'#1384db'} loading={loading} size={150} />
                    </div>
                    :
                    <Container>
                        <p></p>
                        <p></p>
                        <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>Choose categories</p>
                        <Row>
                            <Col>
                                {groups.map(group => (
                                    <Button
                                        className="btn"
                                        key={group}
                                        type="checkbox"
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
                        <p></p>
<Row>
                        <div className="d-grid gap-2">

                            <Button
                                variant={isCollapsed ? "outline-primary" : "primary"}
                                onClick={toggleCollapse}
                            ><Settings /></Button>

                            {!isCollapsed && (
                                <div>
                                    <p></p>
                                    <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>Choose level(s) and amount</p>
                                    <Row>
                                        <Col className="d-flex justify-content-center">
                                            <div>
                                                <div>
                                                    {/* <button onClick={() => setSelectedLevels([2])}>Set only 2</button> */}
                                                    {/* <button onClick={() => setSelectedButtons([1, 2, 3, 4])}>Select All</button> */}
                                                </div>
                                                <div className="button-group">
                                                    <ButtonGroup>
                                                        {levels.map((levelNumber) => (
                                                            <Button
                                                                key={levelNumber}
                                                                onClick={() => handleLevelClick(levelNumber)}
                                                                className={selectedLevels.includes(levelNumber) ? 'selected' : ''}
                                                                variant={selectedLevels.includes(levelNumber) ? 'secondary' : 'outline-dark'}
                                                            >
                                                                {levelNumber}
                                                            </Button>
                                                        ))}
                                                    </ButtonGroup>
                                                </div>
                                                {/* <div>Selected Buttons: {selectedLevels.join(', ')}</div> */}
                                            </div>
                                        </Col>
                                        {/* </Row> */}
                                        {/* Choice Chips Equipments */}
                                        {/* <p></p> */}
                                        {/* <Row> */}
                                        <Col className="d-flex justify-content-center">
                                            <div>
                                                <ButtonGroup>
                                                    <Button variant="secondary" size="md" onClick={handleDecrement}>-</Button>
                                                    <Button variant="outline-dark" size="md"> {count} </Button>
                                                    <Button variant="secondary" size="md" onClick={handleIncrement}>+</Button>
                                                </ButtonGroup>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>Choose your equipment</p>
                                    <Row>
                                        <Col>

                                            {equipments.map(equipment => (
                                                <Button
                                                    className="my-button"
                                                    key={equipment}
                                                    type="checkbox"
                                                    variant={selectedEquipments.includes(equipment) ? 'secondary' : 'outline-dark'}
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
                                    <hr />
                                    {/* <Row>
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
                                    </Col>
                                </Row>
                            </Form>
                        </Row> */}





                                </div>
                            )}
                        </div>
                        </Row>


                        {/* <p></p> */}
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
                        </Row>
                        <p></p>
                        <Row>
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
                        <hr />

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