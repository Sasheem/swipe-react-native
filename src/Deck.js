import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder
} from 'react-native';

class Deck extends Component {

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();

    // defined as a local variable
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: () => {}
    });
    /*
    1- called anytime the user taps on the screen
      if we return true, then we want this pan responder to be responsible for that gesture
      if we return false, then we don't want this to be related to that gesture occuring from user
    2- a callback called anytinme the user drags their finger across the screen
    3- called anytime the user removes their finger from the screen
      good place to do some finalized callback stuff
    */

    // stay out of the habit of mutating state directly, biting my tongue cause of the official docs
    this.state = { panResponder, position };
  }

  renderCards() {
    return this.props.data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            style={this.state.position.getLayout()}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }
      return this.props.renderCard(item);
    });
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

export default Deck;
