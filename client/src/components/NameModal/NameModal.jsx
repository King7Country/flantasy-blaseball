import React, { Component } from 'react'
import "./NameModal.scss"

class NameModal extends React.Component {
    
    handleTeamName = (event) => {
        console.log(event.target.value);
        this.props.onChange(event.target.value);
    }

    handleCloseModal = (event) => {
        console.log(event.target.value);
        this.props.onClick(event.target.value);
    }

        render() {
            
            if (this.props.modalTeamName) {
                return (
                    <div className="modal">
                
                        <div 
                            className="modal__container"
                            >
                            <input
                                name="teamName"
                                className="modal__input"
                                value={this.props.teamName}
                                onChange={this.handleTeamName}
                                type="text"
                                placeholder="Team Name"
                                />
                            <button 
                                className="modal__button"
                                onClick={this.handleCloseModal}
                                
                                >
                                Select Team Name
                            </button>
                        </div>
                        
                    </div>
                ) 
            } else {
                return (
                    null
                )
            } 

            // return (
            //     <div className="modal">
    
            //         <div 
            //             className="modal__container"
            //             // onSubmit={this.handleSubmit}
            //             >
            //             <input
            //                 name="teamName"
            //                 className="modal__input"
            //                 value={this.props.teamName}
            //                 onChange={this.handleChange}
            //                 type="text"
            //                 placeholder="Team Name"
            //                 />
            //             <button 
            //                 className="modal__button"
                            
            //                 >
            //                 Select Team Name
            //             </button>
            //         </div>
                    
            //     </div>
            // )
        }
}

export default NameModal
