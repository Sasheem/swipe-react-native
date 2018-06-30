import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
      onPanResponderRelease: () => {
        this.resetPosition();
      }
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

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0}
    }).start();
  }

  getCardStyle() {
    const { position } = this.state;

    // interpolation comes into play here
    const rotate = position.x.interpolate({
      // tie the input value of x with how much the card shjoud be rotated
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  renderCards() {
    return this.props.data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={this.getCardStyle()}
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
