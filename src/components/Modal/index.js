import React, { Component } from 'react'
import './modal.css';

class Modal extends Component {
    render() {
        return (
            <div className={`modal ${this.props.isAberto && 'modal--isAtivo'}` }>
                <div className="modal__wrap">
                    {this.props.isAberto && this.props.children}
                </div>
            </div>
        )
   }
}

 export default Modal