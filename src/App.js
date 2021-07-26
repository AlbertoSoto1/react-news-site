import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";
import logo from "./img/logo.png";

import Index from "./components/Index";
import Principal from "./components/Principal";
import Notice from "./components/Notice";
import Login from "./components/Login";
import List from "./components/List";
import Edit from "./components/Edit";
import Create from "./components/Create";

class App extends Component {
  render() {
    return (
        <Router>
            {/*  Header con menu de navegacion y  logotipo*/}
            <Navbar bg="dark" variant="dark" expand="lg" className="navbar-dark bg-dark">
                <Navbar.Brand><Link to="/" className="navbar-brand"><Image fluid src={logo}/></Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Link to="/" className="nav-link">Home</Link>
                        <NavDropdown title="Categorias" id="basic-nav-dropdown">
                            <NavDropdown.Item><Link to="/category/1" className="dropdown-item">Tecnología</Link></NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item><Link to="/category/2" className="dropdown-item">Deportes</Link></NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item><Link to="/category/3" className="dropdown-item">Videojuegos</Link></NavDropdown.Item>
                        </NavDropdown>
                        <Link to="/login" className="nav-link">Ingresar</Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {/* react router*/}
            <br/>
            <Route path="/" exact component={Index}/>
            <Route path="/category/:cat" component={Principal}/>
            <Route path="/notice/:id" component={Notice}/>
            <Route path="/login" component={Login}/>
            <Route path="/list/:user" component={List}/>
            <Route path="/edit/:id" component={Edit}/>
            <Route path="/create/:user" component={Create}/>
            {/* Footer */}
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Text>Hilario, Alberto. Derechos reservados © 2019.</Navbar.Text>
            </Navbar>
        </Router>
    );
  }
}

export default App;
