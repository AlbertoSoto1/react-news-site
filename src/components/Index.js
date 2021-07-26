import React, {Component} from "react";
import { Link } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";

import firebase from "./Firestore";
var db = firebase.firestore();

export default class Index extends Component{
    constructor(props){
        super(props);
        this.state= {
            recientes: [],
            likeadas: [],
            primero: new Object(),
            titutlo: "",
            imagen: "",
            idPlus: ""
        }
    }
    
    getRecientes(){
        var vacio = [];
        var noticiasRef = db.collection("noticias");
        var query = noticiasRef.orderBy("timeStamp","desc").limit(6).get().then((querySnapshot) => {
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
    
    getLikeadas(){
        var vacio = [];
        var noticiasRef = db.collection("noticias");
        var query = noticiasRef.orderBy("likes","desc").limit(9).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var documento = new Object();
                documento.id = doc.id;
                documento.data = doc.data();
                vacio.push(documento);
            });
            this.setState({
                primero: vacio.shift(),
                likeadas: vacio
            });
            this.setState({
                titulo: this.state.primero.data.titulo,
                imagen: this.state.primero.data.imagen,
                idPlus: this.state.primero.id
            });
        });
    }
    
    componentDidMount(){
        this.getLikeadas();
        this.getRecientes();
    }
    
    tabRecent(){
        var componentes =[]
        this.state.recientes.forEach((reciente) => {
            componentes.push(
                <Container key={reciente.id}><Link to={"/notice/" + reciente.id}><h5>{reciente.data.titulo}</h5><p>{reciente.data.fecha + " @ " + reciente.data.hora}</p><NavDropdown.Divider /></Link></Container>
            );
        });
        return componentes;
    }
    
    tabLike(){
        var componentes =[]
        this.state.likeadas.forEach((likeada) => {
            componentes.push(
                <Col sm="12" md="4" key={likeada.id}>
                        <Container>
                            <picture>
                                <Image fluid src={likeada.data.imagen}/>
                                <Link to={"/notice/" + likeada.id}><h4>{likeada.data.titulo}</h4></Link>
                                <NavDropdown.Divider />
                            </picture>
                        </Container>
                    </Col>
            );
        });
        return componentes;
    }
    
    render(){
        return(
            <Container>
                <Row>
                    <h1>La más likeadas</h1>
                </Row>
                {/* Contenedor para noticias más vistas*/}
                <Row>
                    <Col sm="12" md="8">
                        <Container>
                            <picture>
                                <Image fluid src={this.state.imagen}/>
                                <Link to={"/notice/" + this.state.idPlus}><h1>{this.state.titulo}</h1></Link>
                                <NavDropdown.Divider />
                            </picture>
                        </Container>
                    </Col>
                    <Col sm="12" md="4">
                        {this.tabRecent()}
                    </Col>
                </Row>
                {/* Contenedor de las siguientes mas vistas */}
                <Row>
                    <h1>Las siguientes...</h1>
                </Row>
                <Row>
                    {this.tabLike()}
                </Row>
            </Container>
        );
    }
}