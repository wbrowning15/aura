import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ImageSourcePropType } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Event = {
    id: string;
    title: string;
    date: string;
    image: ImageSourcePropType;
    status: 'mine' | 'all'; //only 2 types of status
  };

const events: Event[] = [
  {
    id: '1',
    title: 'Coachella',
    date: 'Apr 11 - Apr 20',
    image: require('../assets/images/coachellaSample.png'),
    status: 'mine',
  },
  {
    id: '2',
    title: 'Rolling Loud - California',
    date: 'May 10 - May 12',
    image: require('../assets/images/RLSample.png'),
    status: 'mine',
  },
  {
    id: '3',
    title: "Wallace's lit house party",
    date: 'June 15',
    image: require('../assets/images/housePartySample.png'),
    status: 'mine',
  },
  {
    id: '4',
    title: 'USC vs UCLA',
    date: 'August 69',
    image: require('../assets/images/footballSample.png'),
    status: 'all',
  },
  // Add more events here
];

type EventCardProps = {
    event: Event;
  };

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
      <View style={styles.card}>
        <Image source={event.image} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <View style={styles.textWrapper}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
};

const EventListScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'mine' | 'all'>('mine');

  const filteredEvents = events.filter(event => event.status === selectedTab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {selectedTab === 'all' && (
          <FontAwesome name="search" size={24} color="black" style={styles.searchIcon} />
        )}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, selectedTab === 'mine' && styles.activeTab]} onPress={() => setSelectedTab('mine')}>
              <Text style={[styles.tabText, selectedTab === 'mine' && styles.activeTabText]}>My Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, selectedTab === 'all' && styles.activeTab]} onPress={() => setSelectedTab('all')}>
              <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>All Events</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FontAwesome name="user-circle" size={24} color="black" />
      </View>
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.eventList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
  },
  tabsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTab: {
    backgroundColor: '#800080',
  },
  activeTabText: {
    color: '#fff',
  },
  eventList: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    marginRight: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  viewButton: {
    backgroundColor: '#800080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default EventListScreen;