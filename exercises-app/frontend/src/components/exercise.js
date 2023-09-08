import React,{useState,useEffect} from "react";
import ExerciseDataService from "../services/exercises"
//import {Link} from 'react-router-dom'

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
//import Image from 'react-bootstrap/Image';
//import { Media } from "react-bootstrap";
//import Button from 'react-bootstrap/Button';
//import Media from 'react-bootstrap/Media';


const Exercise = props => {

const [exercise, setExercise] = useState({
    id: null,
    name: "",
    group: "",
    //reviews:[]
})

const getExercise = id =>{
    ExerciseDataService.get(id)
    .then(response =>{
        setExercise(response.data)
        console.log(response.data)
    })
}

useEffect(() => {
    getExercise(props.match.params.id)
},[props.match.params.id])

return(
    <div>
        <Container>
            <Row>
                <Col>
                {/* <Image src={Exercise.poster+"/100px250"}
                fluid /> */}
                </Col>
                <Col>
                    <Card>
                        <Card.Header as="h5">{exercise.name}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                            {exercise.group}
                            </Card.Text>
                            {/* {props.user&&<Link to {... "/exercises/" + props.match.params.id +"/review"}>Add Review</Link>} */}
                        </Card.Body>
                    </Card>
                    <br></br>
                    <h2>Reviews</h2>
                    <br></br>
                    {/* {movie.reviews.map((review,index) => {
                        return (
                            <Card key={index}>
                                <Card.Body>
                                <h5>{review.name + " reviewed on " +review.date}</h5>
                                <p>{review.review}</p>
                                {props.user && props.user.id === review.user_id &&
                                    <Row>
                                        <Col><Link to ={{
                                            pathname:"/movies" + props.match.params.id + "/review", state: {currentReview:review}
                                        }}>Edit</Link>
                                        </Col>
                                        <Col><Button variant="link">Delete</Button></Col>
                                    </Row>
                                    }
                                    </Card.Body>
                            </Card>
                        )
                    })} */}
                </Col>
            </Row>
            </Container>
    </div>
);
}

export default Exercise;