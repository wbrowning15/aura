import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

type POIType = 'restroom' | 'stage' | 'concessions';

interface POI {
  id: string;
  name: string;
  description: string;
  type: POIType;
  x: number; // X coordinate on the map
  y: number; // Y coordinate on the map
}

type Event = {
  id: string;
  title: string;
  date: string;
  image: any;
  map: any;
  status: 'mine' | 'all';
};

const MapScreen = () => {
  const { event } = useLocalSearchParams();
  const eventParsed: Event = event ? JSON.parse(event as string) : null;
  const navigation = useNavigation();

  if (!eventParsed) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No event data available</Text>
      </SafeAreaView>
    );
  }

  const mapImage = eventParsed.map;

  const POIs: POI[] = [
    { id: '1', name: 'Main Stage', description: 'Main stage where the headline acts perform', type: 'stage', x: 100, y: 200 },
    { id: '2', name: 'Food Court', description: 'Various food stands and trucks', type: 'concessions', x: 300, y: 400 },
    { id: '3', name: 'Restrooms', description: 'Public restrooms', type: 'restroom', x: 150, y: 600 },
  ];

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1);
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const handlePOIPress = (poi: POI) => {
    alert(`${poi.name}\n${poi.description}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <Image source={mapImage} style={styles.map} resizeMode="contain" />
          <View style={styles.overlay}>
            {POIs.map((poi) => (
              <TouchableOpacity key={poi.id} onPress={() => handlePOIPress(poi)} style={[styles.poiContainer, { top: poi.y, left: poi.x }]}>
                <View style={[styles.poi, poiStyles[poi.type] as any]} />
                <Text style={styles.poiLabel}>{poi.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
};

const poiStyles = StyleSheet.create({
  stage: {
    backgroundColor: 'blue',
    borderRadius: 10,
    width: 20,
    height: 20,
  },
  concessions: {
    backgroundColor: 'green',
    width: 20,
    height: 20,
  },
  restroom: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    zIndex: 1,
    padding: 10,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  poiContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  poi: {
    width: 20,
    height: 20,
  },
  poiLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
});

export default MapScreen;
