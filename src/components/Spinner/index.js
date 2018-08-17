import React, { Component } from 'react'
import './loader.css'

class Spinner extends Component {
    render() {
        return (
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        )
    }
}

export default Spinner