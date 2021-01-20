import React,{ Component }  from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import SignIn from './Components/SignIn/SignIn';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/logo/logo';

import Imagelinkform from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Imagerecognition from './Components/Imagerecognition/Imagerecognition';
import Register from './Components/Register/Register.js';



const app = new Clarifai.App({
 apiKey: '7da7b73734434e2db175049a3d360ff4'
});



const particlesoptions={
    particles: {
                number:{
                  value:300,
                  density:{
                    enable:true,
                     value_area:800
                  }
                }
                } 
              }


const initialstate={
  
      input:'',
      imageUrl: '',
      box:{},
      route:'signin',
      isSignedIn:false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined :''
      }
    
}
class App extends Component {
  constructor(){
    super();
    this.state=initialstate;
  }
  loadUser = (data) =>{
this.setState({
   user:{
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined :data.joined
      }
})
  }




onInputChange = (event) =>{
this.setState({input:event.target.value});
}





calculateFaceLocation=(data)=>{
const face= data.outputs[0].data.regions[0].region_info.bounding_box;
const image = document.getElementById('inputimage');
const width=Number(image.width);
const height = Number(image.height);
console.log(width,height);
return{
  leftCol:face.left_col * width,
  topRow:face.top_row*height,
  rightCol:width - (face.right_col*width),
  bottomRow:height - (face.bottom_row*height)
  }
}

displayFaceBox = (box)=>{
  console.log(box);
this.setState({box:box});
}

onRouteChange=(route)=>{

  if(route==='signout'){
    this.setState(this.initialstate)
  }
  else if(route==='home'){
      this.setState({isSignedIn:true})
  }
 this.setState({route:route})
 console.log(route);
}



  /* app.models
      .predict(
        // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
        // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
        // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
        // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
        // is to use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
        // so you would change from:
        // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        // to:
        // .predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
       Clarifai.FOOD_MODEL,


app.models.initModel({id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40"})

.then(generalModel => {

return generalModel.predict("@@sampleTrain");

})

.then(response => {

var concepts = response['outputs'][0]['data']['concepts']

})
response.outputs[0].data.regions[0].region_info.bounding_box



       */

       onPictureSubmit= () =>{
 
    this.setState({imageUrl: this.state.input});
     app.models.initModel(Clarifai.FACE_DETECT_MODEL, this.state.input).then(  
       app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
       .then(response => {
     
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log);

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
        .catch(err=>console.log(err)))
    
      }

  render(){
  return (
    <div className='app'>
           <Particles className='particles'
              params={particlesoptions}
       
   />
    <Navigation isSignedIn = {this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
 {  (this.state.route==='home')
  ? <div>
     <Logo/>
     <Rank name={this.state.user.name} entries={this.state.user.entries}/>
     <Imagelinkform onInputChange={this.onInputChange} 
       onPictureSubmit = {this.onPictureSubmit}/>
      <Imagerecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
 
   </div>
:   ((this.state.route==='signin')
?  <SignIn  loadUser = { this.loadUser } onRouteChange={this.onRouteChange}/>
:  <Register  loadUser = { this.loadUser } onRouteChange={this.onRouteChange}/>)} 

    </div>
  );
}
}

export default App;
