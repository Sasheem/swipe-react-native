import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
  /*Deck component will look at props provided
  and if its given any props that are not listed
  in defaultProps below then it will automatically assign
  the properties inside defaultProps
  */
  static defaultProps = {
    // this means that if the user does not pass in a prop called onSwipeRight
    // then the component itself will use this function as a default instead
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  }

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();

    // defined as a local variable
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (evt, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
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
    this.state = { panResponder, position, index: 0 };
  }

  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];

    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);

    // official docs say to attach animation to state.
    // breaks convension of 'do not mutate state'
    // another example of this would be right after this.state.position we did
    // this.state.++
    this.state.position.setValue({ x: 0, y: 0 })
    this.setState({ index: this.state.index + 1 });
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
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, cardIndex ) => {
      if (cardIndex < this.state.index ) { return null; }

      if (cardIndex === this.state.index) {
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
