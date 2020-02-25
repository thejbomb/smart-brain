import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import Ranking from './components/Ranking/Ranking';

const particlesOptions = {
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  previousInput: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  invalid: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  },
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocations = (data) => {
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });
  }

  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  LoadRankings = () => {
    //fetch('https://floating-plains-22616.herokuapp.com/rankings') 
    fetch('http://localhost:3000/rankings')
      .then(response => response.json())
      .then(data => {
        this.setState({rankingList: data});
        console.log('bye');
      })
  }

  onButtonSubmit = () => {
    if ((this.state.input.includes('.png') || this.state.input.includes('.jpeg') || this.state.input.includes('.jpg')) &&
    this.state.input !== this.state.previousInput) {
      this.setState({imageUrl: this.state.input});

      //fetch('https://floating-plains-22616.herokuapp.com/imageurl', {
        fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          //fetch('https://floating-plains-22616.herokuapp.com/image', {
          fetch('http://localhost:3000/image', {
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
            .catch(console.log)

        }
        this.displayFaceBoxes(this.calculateFaceLocations(response))
      })
      .catch(err => console.log(err));

      this.setState({previousInput: this.state.input});
      this.setState({invalid: false});
    } else {
      this.setState({invalid: true});
    }
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes, invalid } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />

        {(() => {
          if (route === 'home') {
            return (
              <div>
                <Logo />
                <Rank
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                />
                <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                />
                { invalid === true ?
                  <div className="pa2 f4 dark-red b">
                    <p>
                      Invalid input. <br/>Please use a jpeg/png url or use a different url.
                    </p>
                    <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
                  </div>
                  : <div>
                      <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
                    </div>
                  }
              </div>
            )
          } else if (route === 'signin') {
            return (
              <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
          } else if (route === 'register') {
            return (
              <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
          } else if (route === 'rankings') {
            return (
              <Ranking onRouteChange={this.onRouteChange}/>
            )
          }
        })()}
      </div>
    )
  }
}

export default App;