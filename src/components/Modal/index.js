import React, { Component } from 'react'
import './modal.css';

class Modal extends Component {
    render() {
        return (
            <div className={`modal ${this.props.isAberto && 'modal--isAtivo'}` } 
                onClick={this.props.fechaModal}>
                <div className="modal__wrap">
                    <button className="btn btn--blue btn--remove modal__close">X</button>
                    {this.props.isAberto && this.props.children}
                </div>
            </div>
        )
   }
}

 export default Modal