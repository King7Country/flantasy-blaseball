import React from 'react'
import "./DraftModal.scss"

class NameModal extends React.Component {
    

    handleCloseModal = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        this.props.onClick(event.target.value);
    }

        render() {
            
            if (this.props.modalMessage) {
                return (
                    <div className="modal">
                
                        <div className="modal__container">
                            <p className="modal__text">{this.props.modalMessage}</p>
                            <button 
                                className="modal__button"
                                onClick={this.handleCloseModal}
                                >
                                Close
                            </button>
                        </div>
                        
                    </div>
                ) 
            } else {
                return (
                    null
                )
            } 

        }
}

export default NameModal
