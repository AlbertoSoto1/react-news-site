import React, {Component} from "react";
import { Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";

import firebase from "./Firestore";
var db = firebase.firestore();

export default class Create extends Component{
    constructor(props){
        super(props);
        this.state={
            title: "",
            image: "",
            text: "",
            category: 1,
            to: false,
            idNew: ""
        }
        
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
    }
    
    onChangeImage(e){
        this.setState({
            image: e.target.value
        });
    }
    
    onChangeTitle(e){
        this.setState({
            title: e.target.value
        });
    }
    
    onChangeText(e){
        this.setState({
            text: e.target.value
        });
    }
    
    onChangeCategory(e){
        this.setState({
            category: e.target.value
        });
    }
    
    addZero(i){
        if(i<10){
            i = '0' + i;
        }
        return i;
    }
    
    onSubmit(e){
        e.preventDefault();
        
        var today = new Date();
        var date = today.getFullYear() + "-" + this.addZero(today.getMonth()+1) + "-" + this.addZero(today.getDate());
        var time = this.addZero(today.getHours()) + ":" + this.addZero(today.getMinutes()) + ":" + this.addZero(today.getSeconds()); 
        
        const obj={
            texto: this.state.text,
            imagen: this.state.image,
            titulo: this.state.title,
            idAutor: this.props.match.params.user,
            fecha: date,
            hora: time,
            likes: 0,
            categoria: this.state.category.toString(),
            timeStamp: today
        }
        
        db.collection('noticias').add(obj)
        .then(ref => {
            this.setState({
                to:true,
                idNew: ref.id
            });
        });
        
    }
    
    render(){
        if(this.state.to===true){
            return (<Redirect to={"/notice/" + this.state.idNew}/>);
        } else {
            return(
                //Contenedor principal
                <Container>
                   <Row>
                       <Col sm="12" md="3"></Col>
                    <Col sm="12" md="6">
                        <h1>Rellene los campos</h1>
                        <h6>Todos los campos son obligatorios</h6>
                        <Image fluid src={this.state.image}></Image>
                        <Form onSubmit={e =>this.onSubmit(e)}>
                            <Form.Label>Título</Form.Label>
                            <Form.Control type="text" required onChange={this.onChangeTitle}/>
                            <Form.Label>URL de imagen</Form.Label>
                            <Form.Control type="text" required onChange={this.onChangeImage}/>
                            <Form.Label>Cuerpo de la  noticia</Form.Label>
                            <Form.Control as="textarea" rows="5" required onChange={this.onChangeText}/>
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control as="select" onChange={this.onChangeCategory}>
                                <option value="1">Tecnología</option>
                                <option value="2">Deportes</option>
                                <option value="3">Videojuegos</option>
                            </Form.Control>
                            <Button variant="primary" type="submit">Publicar Noticia</Button>
                        </Form>
                    </Col>
                    <Col sm="12" md="3"></Col>
                   </Row>
                </Container>
            );
        }
    }
}