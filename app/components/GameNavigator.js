import React from 'react';
import { StyleSheet, Text, View, Button, PanResponder, Dimensions, Image, Animated, TouchableOpacity, AsyncStorage } from 'react-native';
import {
  createNavigator,
  createNavigationContainer,
  TabRouter,
  addNavigationHelpers,
} from 'react-navigation';
import Game from './Game';
import Blitz from './Blitz';
import BlitzJoin from './BlitzJoin';
import shuffledDeck from '../helpers/shuffledDeck';




const GameScreen = ({ navigation }) => (
  <Game banner="Game Screen" navigation={navigation}/>
);

const BlitzScreen = ({ navigation }) => (
  <Blitz banner="Blitz Screen" navigation={navigation} />
);


const CustomTabView = ({ router, navigation }) => {
  const { routes, index } = navigation.state;
  const ActiveScreen = router.getComponentForRouteName(routes[index].routeName);
  return (
    <View style={{flex: 1}}>
      <ActiveScreen
        navigation={addNavigationHelpers({
          dispatch: navigation.dispatch,
          state: routes[index],
        })}
        screenProps={{}}
      />
    </View>
  );
};

const CustomTabRouter = TabRouter(
  {
    Classic: {
      screen: Game,
      path: 'Classic',
    },
    Blitz: {
      screen: Blitz,
      path: 'Blitz',
    },
    BlitzJoin: {
      screen: BlitzJoin,
      path: 'BlitzJoin',
    }
  },
  {
    initialRouteName: 'Classic',
  }
);


const CustomTabs = createNavigationContainer(
  createNavigator(CustomTabRouter)(CustomTabView)
);


export default CustomTabs;
