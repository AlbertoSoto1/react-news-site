import React, {Component} from "react";
import { Link } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
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

export default class Notice extends Component{
    constructor(props){
        super(props);
        this.state={
            text: "",
            image: "",
            title: "",
            idAuthor: "",
            date: "",
            time: "",
            likes: "",
            category: "",
            nameAut: "",
            surAut: "",
            recientes: [],
            nombre: "",
            textComent: "",
            comentarios: []
        }
        
        this.fill = this.fill.bind(this);
        this.likePlus = this.likePlus.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }
    
    onChangeText(e){
        this.setState({
            textComent: e.target.value
        });
    }
    
    onChangeName(e){
        this.setState({
            nombre: e.target.value
        });
    }
    
    getRecientes(){
        var vacio = [];
        var noticiasRef = db.collection("noticias");
        var query = noticiasRef.where("categoria","==",this.state.category).orderBy("timeStamp","desc").limit(6).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var documento = new Object();
                documento.id = doc.id;
                documento.data = doc.data();
                vacio.push(documento);
            });
            this.setState({
                recientes: vacio
            });
        });
    }
    
    getComents(){
        var vacio = [];
        var noticiasRef = db.collection("comentarios");
        var query = noticiasRef.where("idNoticia","==",this.props.match.params.id).orderBy("timeStamp","desc").limit(10).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var documento = new Object();
                documento.id = doc.id;
                documento.data = doc.data();
                vacio.push(documento);
            });
            this.setState({
                comentarios: vacio
            });
        });
    }
    
    componentDidMount(){
        this.fill();
        this.getRecientes();
        this.getComents();
    }
    
    tabComents(){
        var componentes =[];
        this.state.comentarios.forEach((comentario) => {
            componentes.push(
                        <Container key={comentario.id}>
                                <h6>{comentario.data.nombre + ", " + comentario.data.timeStamp.toDate()}</h6>
                                <p>{comentario.data.texto}</p>
                                <NavDropdown.Divider />
                        </Container>
            );
        });
        return componentes;
    }
    
    tabRecent(){
        //this.getRecientes();
        var componentes =[];
        this.state.recientes.forEach((reciente) => {
            componentes.push(
                <Col sm="12" md="4" key={reciente.id}>
                        <Container>
                            <picture>
                                <Image fluid src={reciente.data.imagen}/>
                                <Link to={"/notice/" + reciente.id}><h4>{reciente.data.titulo}</h4></Link>
                                <NavDropdown.Divider />
                            </picture>
                        </Container>
                    </Col>
            );
        });
        return componentes;
    }
    
    fill(){
        var notiRef = db.collection('noticias').doc(this.props.match.params.id);
        notiRef.get().then(doc => {
            if(!doc.exists){
                console.log("No such Document!");
            } else {
                this.setState({
                    text: doc.data().texto,
                    image: doc.data().imagen,
                    title: doc.data().titulo,
                    idAuthor: doc.data().idAutor,
                    date: doc.data().fecha,
                    time: doc.data().hora,
                    likes: doc.data().likes,
                    category: doc.data().categoria,
                });
                
                db.collection('autores').doc(this.state.idAuthor).get().then(aut => {
                    if(!aut.exists){
                        console.log("no such Document!");
                    } else {
                        this.setState({
                            nameAut : aut.data().nombre,
                            surAut : aut.data().apellido,
                        });
                        this.getRecientes();
                    }
                });
            }
        }).catch(err => {
            console.log("Error Gettin Document", err);
        });
        
    }
    
    likePlus(){
        var document = db.collection("noticias").doc(this.props.match.params.id);
        document.update({
            likes: this.state.likes + 1
        }).then(() => {
            this.setState({
                likes: this.state.likes+1
            });
        });
    }
    
    onSubmit(e){
        e.preventDefault();
        var today = new Date();
        const obj ={
            nombre: this.state.nombre,
            texto: this.state.textComent,
            idNoticia: this.props.match.params.id,
            timeStamp: today
        };
        
        db.collection('comentarios').add(obj)
        .then(ref => {
            this.setState({
                nombre: "",
                textComent: ""
            });
            this.getComents();
            });
    }
    
    render(){
        
        return(
            // Contenedor principal
            <Container>
                <Row>
                    <Col sm="0" md="2"></Col>
                    <Col sm="0" md="8">
                        <Container>
                            <h1>{this.state.title}</h1>
                            <picture>
                                <Image fluid src={this.state.image}/>
                            </picture>
                            <p>por {this.state.nameAut} {" " + this.state.surAut} el {this.state.date} a las {this.state.time} hrs.</p>
                            <NavDropdown.Divider />
                            <Container>
                                <p>{this.state.text}</p>
                            </Container>
                            <Button variant="success" onClick={this.likePlus}>({this.state.likes}) like++</Button>
                        </Container>
                    </Col>
                    <Col sm="0" md="2"></Col>
                </Row>
                {/* comentarios */}
                <Row>
                    <Col sm="0" md="2"></Col>
                    <Col sm="0" md="8">
                       <h3>Comentarios</h3>
                        <Form onSubmit={e => this.onSubmit(e)}>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" required onChange={this.onChangeName} value={this.state.nombre}/>
                            <Form.Label>Escribe tu comentario</Form.Label>
                            <Form.Control as="textarea" rows="3"  required onChange={this.onChangeText} value={this.state.textComent}/>
                            <Button variant="primary" type="submit">Comentar</Button>
                        </Form>
                        {this.tabComents()}
                    </Col>
                    <Col sm="0" md="2"></Col>
                </Row>
                {/* Contenedor para las siguientes mas recientes */}
                <Row>
                    <h3>Las más recientes...</h3>
                </Row>
                <Row>
                    {this.tabRecent()}
                </Row>
            </Container>
        );
    }
}