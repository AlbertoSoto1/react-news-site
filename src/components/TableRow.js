import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TableRow extends Component {
    
    delete(){
        this.props.Db.collection("noticias").doc(this.props.obj.id).delete()
            .then(() => {
                console.log("Document successfully deleted!");
                this.props.refrescar();})
            .catch(function(error) {
            console.error("Error removing document: ", error);
            });
    }
		
  render() {
    return (
        <tr>
          <td>
            {this.props.obj.data.titulo}
          </td>
        <td>
            {this.props.obj.data.fecha}
          </td>
          <td>
            {this.props.obj.data.likes}
          </td>
          <td>
            <Link to={"/edit/"+this.props.obj.id} className="btn btn-primary">Editar</Link>
            <button onClick={()=>this.delete()} className="btn btn-danger">Eliminar</button>
          </td>
        </tr>
    );
  }
}

export default TableRow;