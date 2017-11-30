import React, {Component} from 'react';
import uuidv4 from 'uuid/v4';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      message: ''
    };
  }

  // update username state on input change (chatbar-username)
  _updateUsername = (event) => {
    this.setState({
      username: event.target.value
    });
  }

  // update content state on input change (chatbar-message)
  _updateMessage = (event) => {
    this.setState({
      message: event.target.value
    })
  }

  // handle key press and call parent addMessage function
  // to add new message to chat log
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.addMessage({
        id: uuidv4(),
        username: this.state.username,
        content: this.state.message,
        type: 'normal'
      });
      this.setState({
        message: ''
      });
    }
  }

  render() {
    return (
        <footer className="chatbar" onKeyPress={this._handleKeyPress}>
            <input className="chatbar-username" value={this.state.username} onChange={this._updateUsername}/>
            <input className="chatbar-message" value={this.state.message} placeholder="Type a message and hit ENTER" onChange={this._updateMessage} />
        </footer>
    )
  }
}
export default ChatBar;