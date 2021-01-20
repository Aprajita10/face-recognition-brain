import React from'react';
import './Imagerecognition.css';

const Imagerecognition = ({ imageUrl,box }) =>{
	return(
  <div className='center ma'>
  <div className='absolute mt1'>
  <img src={imageUrl} width='300px' height='auto' id ='inputimage'/>
  <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
  </div>
  </div>
		);


};
export default Imagerecognition;