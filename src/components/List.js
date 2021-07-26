import TableRow from "./TableRow";
import React, {Component} from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";

import firebase from "./Firestore";
var db = firebase.firestore();

export default class List extends Component{
    constructor(props){
        super(props);
        this.state = { noticias: []};
    }
    
    getNoticias(){
        db.collection("noticias").get()
        .then((snapshot) => {
            var vacio = [];
            snapshot.forEach((doc) => {
                var noticia = {};
                if(doc.data().idAutor === this.props.match.params.user){
                    noticia.id = doc.id;
                    noticia.data = doc.data();
                    vacio.push(noticia);
                }
            });
            this.setState({
                noticias : vacio
            });
        })
        .catch((err) => {
            console.log("Error getting documents", err);
        });
    }
    
    componentDidMount(){
        this.getNoticias();
    }
    
    tabRow(){
        var componentes = [];
        this.state.noticias.forEach((noticia) => {
            componentes.push(<TableRow  refrescar={()=>this.getNoticias()} obj={noticia} key={noticia.id} Db={db}/>);
        });
        return componentes;
    }
    
    render(){
        return(
            <Container>
                <h1>Todas las noticias</h1>
                <Link to={"/create/" + this.props.match.params.user}><h3>Crear nueva entrada</h3></Link>
                <Table striped bordered hover>
                    <thead>
                        <th>Título</th>
                        <th>Fecha</th>
                        <th>Likes</th>
                        <th>Acción</th>
                    </thead>
                    <tbody>
                        {this.tabRow()}
                    </tbody>
                </Table>
            </Container>
            
        );
    }
}