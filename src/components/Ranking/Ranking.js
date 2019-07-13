import React from 'react';
import CardList from './CardList';
import ErrorBoundry from './ErrorBoundry';

const LoadRankings = () => {
  fetch('https://floating-plains-22616.herokuapp.com/rankings')
    .then(response => response.json())
    .then(users => {
      console.log(users);
      /*let userList = [...this.state.users];
      for (let i = 0; i < users.length; i++) {
        userList[i] = users[i].name;
      }*/
      this.setState({users: users[0].name});
    }).catch(console.log)
}

class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: 'hi'
    }
    LoadRankings();
  }

  render() {
    
    return (
        <div className='tc'>
            <h1 className='f2'>Rankings</h1>
                <ErrorBoundry>
                    <CardList users={this.state.users} />
                </ErrorBoundry>
    </div>
    );
  }
}

export default Ranking;