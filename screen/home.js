import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchVisible: false,
      transaksi: [],
      deletedTransaksi: [],
      refreshing: false,
    };
  }

  handleSearchPress = () => {
    this.setState(prevState => ({
      isSearchVisible: !prevState.isSearchVisible,
    }));
  };

  componentDidMount() {
    this.getData();
  }

  saveData = async () => {
    try {
      await AsyncStorage.setItem(
        '@transaksi',
        JSON.stringify(this.state.transaksi),
      );
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  saveDeletedData = async () => {
    try {
      await AsyncStorage.setItem(
        '@deletedTransaksi',
        JSON.stringify(this.state.deletedTransaksi),
      );
    } catch (error) {
      console.log('Error saving deleted data:', error);
    }
  };

  getData = async () => {
    try {
      let value = await AsyncStorage.getItem('@transaksi');
      const jsonValue = JSON.parse(value);
      if (jsonValue !== null) {
        this.setState({transaksi: jsonValue});
      }

      let deletedValue = await AsyncStorage.getItem('@deletedTransaksi');
      const deletedJsonValue = JSON.parse(deletedValue);
      if (deletedJsonValue !== null) {
        this.setState({deletedTransaksi: deletedJsonValue});
      }
    } catch (error) {
      console.log('Error retrieving data:', error);
    }
  };

  handleCheckItem = index => {
    const {transaksi, deletedTransaksi} = this.state;
    const updatedTransaksi = [...transaksi];
    const item = updatedTransaksi[index];

    if (item.checked) {
      // Remove the item if it is already checked
      updatedTransaksi.splice(index, 1);
      this.setState(
        {
          transaksi: updatedTransaksi,
          deletedTransaksi: [...deletedTransaksi, item],
        }, // Add the deleted item to the deletedTransaksi array
        () => {
          this.saveData();
          this.saveDeletedData();
          Snackbar.show({
            text: 'Item deleted!',
            duration: Snackbar.LENGTH_SHORT,
            action: {
              text: 'UNDO',
              textColor: '#fff',
              onPress: () => {
                // Add the deleted item back to the transaksi array
                updatedTransaksi.splice(index, 0, item);
                const updatedDeletedTransaksi = deletedTransaksi.filter(
                  deletedItem => deletedItem !== item,
                ); // Remove the item from the deletedTransaksi array
                this.setState(
                  {
                    transaksi: updatedTransaksi,
                    deletedTransaksi: updatedDeletedTransaksi,
                  },
                  () => {
                    this.saveData();
                    this.saveDeletedData();
                  },
                );
              },
            },
          });
        },
      );
    } else {
      // Mark the item as checked
      item.checked = true;
      this.setState({transaksi: updatedTransaksi}, () => {
        this.saveData();
        Snackbar.show({
          text: 'Completed task!',
          duration: Snackbar.LENGTH_SHORT,
          action: {
            text: 'UNDO',
            textColor: '#fff',
            onPress: () => {
              // Unmark the item as checked
              item.checked = false;
              this.setState({transaksi: updatedTransaksi}, () => {
                this.saveData();
              });
            },
          },
        });

        setTimeout(() => {
          if (item.checked) {
            // Remove the item after a delay if it is still checked
            updatedTransaksi.splice(index, 1);
            this.setState({transaksi: updatedTransaksi}, () => {
              this.saveData();
            });
          }
        }, 1000); // Change the color for 3 seconds before deleting
      });
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true}, () => {
      this.getData(); // Memuat ulang data dari penyimpanan
      this.setState({refreshing: false});
    });
  };

  render() {
    const {isSearchVisible, transaksi} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#1E1E1E'}}>
        <StatusBar backgroundColor="#1E1E1E" barStyle={'light-content'} />
        <View
          style={{
            paddingVertical: 15,
            elevation: 3,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginBottom: 15,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {!isSearchVisible && (
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                RENCANAKU
              </Text>
            )}
            {isSearchVisible && (
              <TextInput
                style={{
                  height: 40,
                  width: 200,
                  color: '#fff',
                }}
                placeholder="Search"
                placeholderTextColor="grey"
                onChangeText={this.searchTasks}
              />
            )}
          </View>
          <TouchableOpacity onPress={this.handleSearchPress}>
            <Icon
              name={isSearchVisible ? 'times' : 'search'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={transaksi}
          renderItem={({item, index}) => (
            <View
              style={{
                backgroundColor: '#454545',
                marginHorizontal: 25,
                marginVertical: 10,
                paddingHorizontal: 10,
                paddingVertical: 20,
                borderRadius: 15,
                elevation: 3,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginHorizontal: 10,
                  }}>
                  {item.nama}
                </Text>
                <Text
                  style={{color: '#fff', fontSize: 16, marginHorizontal: 10}}>
                  {item.date}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: item.checked ? '#006fff' : '#ccc',
                  padding: 10,
                  borderRadius: 5,
                  marginHorizontal: 10,
                }}
                onPress={() => this.handleCheckItem(index)}>
                <Icon name="check" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../image/no-task.png')}
                style={{width: 80, height: 80}}
              />
              <Text style={{color: 'grey', fontSize: 18, marginTop: 10}}>
                No assignments yet
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#006fff',
            width: 60,
            height: 60,
            borderRadius: 30,
            marginVertical: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this.props.navigation.navigate('task')}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default Home;
