import React from 'react'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import './ErrorNotice.css'

const ErrorNotice = (props) => {
    return (
        <div className="error-notice">
            <span>{props.message}</span>
            <button  className="remove-error-btn" onClick={props.clearError}><AiOutlineCloseCircle /></button>
        </div>
    )
}

export default ErrorNotice
