import React, { Component } from 'react';
import axios from 'axios';



class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      time: null,
      timezone: null,
      search: '',
      UTCOffset: null,
      searchLoc: null
    }
  }

  componentDidMount(){
    let time = new Date().toLocaleTimeString();
    this.setState({ time: time })
    setInterval( () => this.updateTime(), 1000);
  }
  // componentWillReceiveProps(nextProps){
  //   console.log(nextProps)
  // }
  updateTime(){
    let time = new Date().toLocaleTimeString();
    this.setState({ time: time })
  }
  handleChange = e => {
    this.setState({
      search: e.target.value
    })
  }
  handleSubmit = e => {
    e.preventDefault()
    this.sendgeoSearch(this.state.search);
    this.setState({search: ''});
  }

  render() {
    return (
      <div className="App">
          <div>{this.state.time}</div>
          {this.state.timezone && this.state.searchLoc &&(
            <div>
              <div>{this.state.searchLoc}</div>
              <div>{this.state.timezone}</div>            
            </div>
          )}
          
        <form className="searchForm" onSubmit={e => this.handleSubmit(e)}>
          <input type='text' name='search' value={this.state.search} onChange={e => this.handleChange(e)} placeholder='set timezone by place' />
          <input type='submit' value='search' />
        </form>
      
      </div>
    );
  }

  sendgeoSearch = address => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_URI}${process.env.REACT_APP_GEOCODE}${process.env.REACT_APP_KEY}&address=${address}`
    })
    .then( search => {
      this.setState({
        searchLoc: search.data.results[0].formatted_address
      })
      const timestamp = new Date().getTime();
      const searchQuery = `location=${search.data.results[0].geometry.location.lat},${search.data.results[0].geometry.location.lng}&timestamp=${timestamp/1000}`
      this.sendTimeZoneSearch(searchQuery);
    });
  }

  sendTimeZoneSearch = query => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_URI}${process.env.REACT_APP_TIMEZONE}${process.env.REACT_APP_KEY}&${query}`
    })
    .then(search => {
      this.setState({
        timezone: search.data.timeZoneName,
        UTCOffset: search.data.rawOffset/60/60
      });
    });
  };
}

export default App;
