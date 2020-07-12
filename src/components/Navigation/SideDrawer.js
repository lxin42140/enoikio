import React from 'react';
import classes from './SideDrawer.css';
import Backdrop from '../UI/Backdrop/Backdrop';

const sideDrawer = (props) => {
	let attachedClasses = [classes.SideDrawer, classes.Close];
	if (props.open) {
		attachedClasses = [classes.SideDrawer, classes.Open];
	}
	return (
		<React.Fragment>
			<Backdrop 
				show={props.open} 
				clicked={props.closed} />
			<div className={attachedClasses.join(' ')}>
					{props.children}
			</div>
		</React.Fragment>
	);
}

export default sideDrawer;