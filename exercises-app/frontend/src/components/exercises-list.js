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
import { Shuffle, Search, Settings, Play, Pause, Square } from 'lucide-react';
import { shuffle, scrollToBottom, handleIncrement, Timer } from "./features"

const ExercisesList = props => {
    const [loading, setLoading] = useState(false)


    const [exercises, setExercises] = useState([])
    const [searchName, setSearchName] = useState("")
    const [groups, setGroups] = useState(["All Groups"])
    const [equipments, setEquipments] = useState([])

    const [open, setOpen] = useState({});//collapse
    const [selectedLevels, setSelectedLevels] = useState([2])
    const levels = [1, 2, 3, 4]

    //Intervall settings
    const [count, setCount] = useState(5);
    const [countTimer, setCountTimer] = useState(6);//Time per Exc.
    const [countPause, setCountPause] = useState(4);//Pause Time
    const [countReps, setCountReps] = useState(3);//Number of Reps
    const [countSets, setCountSets] = useState(4);//Number of Sets
    const [countPausebSets, setCountPausebSets] = useState(45);//Pause Time betw. Sets

    const [excItemNum, setExcItemNum] = useState(0);

    //Training View
    const [trainStatus, setTrainStatus] = useState("Prep");

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



    //for Jumping to exercises bottomEl
    const bottomEl = useRef(null);
    useEffect(() => {
        scrollToBottom(bottomEl);
    }, [exercises, excItemNum]);



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
                                        style={{ margin: "3px" }}
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
                                                        <Button variant="secondary" size="md" onClick={() => handleIncrement(count, 1, 12, -1, setCount)}>-</Button>
                                                        <Button variant="outline-dark" size="md"> {count} </Button>
                                                        <Button variant="secondary" size="md" onClick={() => handleIncrement(count, 1, 12, 1, setCount)}>+</Button>
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


                                        <Row>

                                            <Row className="align-items-center">
                                                <Col><p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>Time per exercise</p></Col>
                                                <Col className="d-flex justify-content-center">
                                                    <div>
                                                        <ButtonGroup>
                                                            <Button variant="secondary" size="md" onClick={() => handleIncrement(countTimer, 5, 300, -5, setCountTimer)}>-</Button>
                                                            <Button variant="outline-dark" size="md"> {countTimer} sec</Button>
                                                            <Button variant="secondary" size="md" onClick={() => handleIncrement(countTimer, 5, 300, 5, setCountTimer)}>+</Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className="align-items-center">
                                                <Col><p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>Pause betw. exercises</p></Col>
                                                <Col className="d-flex justify-content-center">

                                                    <div>
                                                        <ButtonGroup>
                                                            <Button variant="secondary" size="md" onClick={() => handleIncrement(countPause, 10, 30, -2, setCountPause)}>-</Button>
                                                            <Button variant="outline-dark" size="md"> {countPause} sec</Button>
                                                            <Button variant="secondary" size="md" onClick={() => handleIncrement(countPause, 10, 30, 2, setCountPause)}>+</Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className="align-items-center">
                                                <Col><p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>Reps of each exercise</p></Col>
                                                <Col className="d-flex justify-content-center">

                                                    <div>
                                                        <ButtonGroup>
                                                            <Button variant="secondary" size="md" onClick={() => handleIncrement(countReps, 1, 30, -1, setCountReps)}>-</Button>
                                                            <Button variant="outline-dark" size="md"> {countReps}</Button>
                                                            <Button variant="secondary" size="md" onClick={() => handleIncrement(countReps, 1, 30, 1, setCountReps)}>+</Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </Col>

                                            </Row>

                                            <Row className="align-items-center">
                                                <Col><p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>Sets</p></Col>
                                                <Col className="d-flex justify-content-center">

                                                    <div>
                                                        <ButtonGroup>
                                                            <Button variant="secondary" size="md" onClick={() => handleIncrement(countSets, 1, 30, -1, setCountSets)}>-</Button>
                                                            <Button variant="outline-dark" size="md"> {countSets}</Button>
                                                            <Button variant="secondary" size="md" onClick={() => handleIncrement(countSets, 1, 30, 1, setCountSets)}>+</Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className="align-items-center">
                                                <Col><p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>Pause between sets</p></Col>
                                                <Col className="d-flex justify-content-center">

                                                    <div>
                                                        <ButtonGroup>
                                                            <Button variant="secondary" size="md" onClick={() => handleIncrement(countPausebSets, 20, 300, -5, setCountPausebSets)}>-</Button>
                                                            <Button variant="outline-dark" size="md"> {countPausebSets}</Button>
                                                            <Button variant="secondary" size="md" onClick={() => handleIncrement(countPausebSets, 20, 300, 5, setCountPausebSets)}>+</Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </Col>
                                            </Row>

                                        </Row>

                                        <hr />



                                    </div>
                                )}
                            </div>
                        </Row>


                        {/* <p></p> */}
                        <Row>
                            <Col>
                                <div className="d-grid gap-2">
                                    <div ref={trainStatus === "Prep" ? bottomEl : null}></div>
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

                                    {(exercises.length > 0 || trainStatus === "Stopped" || trainStatus === "Paused") && !(trainStatus === "Started") ? (
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
                                        </Button>) : null
                                    }
                                </div>
                            </Col>
                        </Row>
                        <p></p>

                        
                            {/* <Col>
                                <div className="d-grid gap-2"
                                    sticky="top">
                                    {trainStatus === "Prep" || trainStatus === "Stopped" || trainStatus === "Paused" ?
                                        <Button
                                            // variant={trainStarted ? "primary" : "outline-primary"}
                                            type="button"
                                            onClick={() => setTrainStatus("Started")}
                                        >
                                            {<Play />}
                                        </Button>
                                        : null}
                                    {trainStatus === "Started" ?
                                        <Button
                                            // variant={trainStarted ? "primary" : "outline-primary"}
                                            type="button"
                                            onClick={() => setTrainStatus("Paused")}
                                        >
                                            <Pause />
                                        </Button>
                                        : null}
                                    {trainStatus === "Started" || trainStatus === "Paused" ?
                                        <Button
                                            // variant={trainStarted ? "primary" : "outline-primary"}
                                            type="button"
                                            onClick={() => setTrainStatus("Stopped")}
                                        >
                                            <Square />
                                        </Button>
                                        : null}
                                </div>
                            </Col> */}

                            {/* <Col> */}
                            <div
                            className={"fixed-buttons"}>
                                
                                {trainStatus === "Started" || trainStatus === "Paused" ? (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setTrainStatus("Stopped")
                                            scrollToBottom(bottomEl)
                                        }}
                                        className={"btn-wide bg-danger"}
                                        variant={"outline-dark"}>
                                        <Square />
                                    </Button>
                                ) : null}

                                {(exercises.length > 0 || trainStatus === "Stopped" || trainStatus === "Paused") && !(trainStatus ==="Started") ? (
                                     <Button
                                     type="button"
                                     className={"btn-wide bg-success"}
                                     onClick={() => {
                                       setTrainStatus("Started");
                                       scrollToBottom(bottomEl);

                                     }}
                                     variant={"outline-dark"}
                                   >
                                     {<Play />}
                                   </Button>
                                ) : null}

                                {trainStatus === "Started" ? (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setTrainStatus("Paused")
                                            scrollToBottom(bottomEl)
                                        }}
                                        className={"btn-wide bg-secondary"}
                                        variant={"outline-dark"}>
                                        <Pause />
                                    </Button>
                                ) : null}


                            </div>
                            {/* </Col> */}
                       
                        <p></p>

                        <div><Timer excItemNum={excItemNum} setExcItemNum={setExcItemNum} TimerVar={countTimer} StatusUser={trainStatus} PauseVar={countPause} MaxExcItem={count} /></div>
                        <br></br>
                        Active excItemNum = {excItemNum}
                        <p>{trainStatus}</p>
                        <hr />
                        <Row>
                            {exercises.map((exercise) => (
                                <Col key={exercise._id}>

                                    {/* <div ref={excItemNum === exercises.findIndex(item => item._id === exercise._id) ? bottomEl : null}></div> */}
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
                                        style={{
                                            width: '20rem',
                                            margin: '5px',

                                            backgroundColor: excItemNum === exercises.findIndex(item => item._id === exercise._id)
                                                ? (exercise.group.includes('cardio')
                                                    ? '#0275d8' // Hex color code for 'cardio'
                                                    : exercise.group.includes('leg')
                                                        ? '#808080' // Hex color code for 'leg'
                                                        : exercise.group.includes('core')
                                                            ? '#5cb85c' // Hex color code for 'core'
                                                            : exercise.group.includes('push')
                                                                ? '#f0ad4e' // Hex color code for 'push'
                                                                : exercise.group.includes('pull')
                                                                    ? '#d9534f' // Hex color code for 'pull'
                                                                    : exercise.group.includes('mobility')
                                                                        ? '#5bc0de' // Hex color code for 'mobility'
                                                                        : exercise.group.includes('walk')
                                                                            ? 'black' // Hex color code for 'walk'
                                                                            : 'black' // Default color
                                                )
                                                : null,
                                            color: excItemNum === exercises.findIndex(item => item._id === exercise._id) ? 'white' : 'black'// Text color
                                        }}>

                                        {/* <Card.Img src={exercise.poster+"/100px180"} /> */}
                                        <Card.Body>
                                            <Card.Title
                                                style={{

                                                }}
                                            >{exercise.name}</Card.Title>
                                            <Card.Text>
                                                <Row>
                                                    <Card.Text className="text-center">{exercise.equipment.join(' or ')}
                                                        <br></br>Number: {exercises.findIndex(item => item._id === exercise._id)}</Card.Text>

                                                    {/* How to perform the exercise */}
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