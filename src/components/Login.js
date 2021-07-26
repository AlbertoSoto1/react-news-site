import React, {Component} from "react";
import { Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import LogImage from "../img/log.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";

import firebase from "./Firestore";
var db = firebase.firestore();

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state={
            logMail: '',
            logPass: '',
            userid: '',
            to: false
        }
        
        this.oncChangeMail = this.oncChangeMail.bind(this);
        this.onChangePass = this.onChangePass.bind(this);
    }
    
    oncChangeMail(e){
        this.setState({
            logMail: e.target.value
        });
    }
    
    onChangePass(e){
        this.setState({
            logPass: e.target.value
        });
    }
    
     onSubmit(e){
         e.preventDefault();
         //e.stopPropagation();
        const obj = {
            mail: this.state.logMail,
            password: this.state.logPass
        }
        
        db.collection("autores").get()
         .then((snapshot) => {
            snapshot.forEach((doc) => {
            if(doc.data().correo === obj.mail && doc.data().pass === obj.password){
                this.setState({
                    userid: doc.id,
                    to: true
                });
            }
        })
            if(!this.state.to){
                 alert("Contraseña/usuatio incorrectos")
             }
        });
    }
    
    render(){
        if(this.state.to===true){
            return (<Redirect to={"/list/" + this.state.userid}/>);
        } else{
            return(
            <Container>
                {/* Contenedor principal*/}
                <Row>
                    <Col sm="12" md="4"></Col>
                    <Col sm="12" md="4">
                       <Image fluid src={LogImage}/>
                        <Form onSubmit={e => this.onSubmit(e)}>
                            <Form.Label>Correo:</Form.Label>
                            <Form.Control type="email" onChange={this.oncChangeMail}/>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" as="input" onChange={this.onChangePass}/>
                            <Button variant="primary" type="submit">Entrar</Button>
                        </Form>
                    </Col>
                    <Col sm="12" md="4"></Col>
                </Row>
            </Container>
        );
        }
    }
}