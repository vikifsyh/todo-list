import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tugas: '',
      date: new Date(),
      showDatePicker: false,
      transaksi: [],
      isModalVisible: false,
    };
  }

  handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    this.setState({date: currentDate, showDatePicker: false});
  };

  showDatePicker = () => {
    this.setState({showDatePicker: true});
  };

  toggleModal = () => {
    this.setState(prevState => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      let value = await AsyncStorage.getItem('@transaksi');
      const tasks = JSON.parse(value);

      if (tasks !== null) {
        const updatedTasks = tasks.map(task => {
          if (task.date) {
            task.date = new Date(task.date); // Convert date string to Date object
          }
          return task;
        });

        this.setState({transaksi: updatedTasks});
      }

      console.log('Data berhasil diambil:', tasks);
    } catch (error) {
      console.log('Gagal mengambil data:', error);
    }
  };

  saveData = async () => {
    try {
      await AsyncStorage.setItem(
        '@transaksi',
        JSON.stringify(this.state.transaksi),
      );
      console.log('data berhasil disimpan');
    } catch (e) {
      console.log('data gagal disimpan');
    }
  };

  prosesTransaksi = () => {
    const {tugas, date} = this.state;

    if (tugas.trim() === '' || !date) {
      // Handle the case when the task or date is empty
      this.toggleModal(); // Show modal
      return;
    }

    const formattedDate = date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const detailTransaksi = {
      nama: tugas,
      date: formattedDate,
    };

    Alert.alert('Berhasil', 'Tugas berhasil tersimpan', [
      {
        text: 'OK',
        onPress: () => this.props.navigation.navigate('home'),
      },
    ]);

    this.setState(
      prevState => ({
        transaksi: [...prevState.transaksi, detailTransaksi],
        tugas: '',
      }),
      () => {
        this.saveData();
      },
    );
  };

  render() {
    const {date, showDatePicker} = this.state;

    return (
      <View style={{backgroundColor: '#1e1e1e', flex: 1}}>
        <View
          style={{
            flexDirection: 'row',

            paddingVertical: 15,
            elevation: 3,
          }}>
          <TouchableOpacity
            style={{marginHorizontal: 10}}
            onPress={() => this.props.navigation.pop()}>
            <Icon name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View
            style={{
              marginHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
              Tugas Baru
            </Text>
          </View>
        </View>

        {/* Task input section */}
        <View style={{marginHorizontal: 10, marginVertical: 30}}>
          <Text style={{color: '#006fff', fontSize: 20, fontWeight: 'bold'}}>
            Apa yang harus dilakukan?
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={{
                color: '#fff',
                borderBottomWidth: 1,
                borderColor: '#fff',
                width: 350,
              }}
              placeholder="Masukkan tugas di sini"
              placeholderTextColor="grey"
              value={this.state.tugas}
              onChangeText={text => this.setState({tugas: text})}
            />
            <Icon name="tasks" size={30} color="#006fff" />
          </View>
        </View>

        {/* Date and time section */}
        <View style={{marginHorizontal: 10, marginVertical: 30}}>
          <Text style={{color: '#006fff', fontSize: 20, fontWeight: 'bold'}}>
            Tanggal dan Waktu
          </Text>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={this.showDatePicker}>
            <TextInput
              style={{
                color: '#fff',
                borderBottomWidth: 1,
                borderColor: '#fff',
                width: 350,
              }}
              value={date.toDateString()}
              placeholder="Tanggal dan waktu"
              placeholderTextColor="grey"
              editable={false}
            />
            <MaterialIcons name="date-range" size={30} color="#006fff" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default"
              onChange={this.handleDateChange}
            />
          )}
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#006fff',
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
            elevation: 3,
          }}
          onPress={() => {
            if (this.state.tugas.trim() === '' || !this.state.date) {
              Alert.alert('Gagal', 'Harap isi tugas dengan benar');
            } else {
              this.prosesTransaksi();
            }
          }}>
          <Icon name="check" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default Task;
