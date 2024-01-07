import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {DataTable} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get('window').height;

const StudentsData = () => {
  const [studentData, setStudentData] = useState([]);
  const [currentSelectedStudentData, setCurrentSelectedStudentData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchStudentsData();
  }, []);

  const fetchStudentsData = async () => {
    try {
      const storedStudentsData = await AsyncStorage.getItem('students');
      if (storedStudentsData) {
        const parsedStudentsData = JSON.parse(storedStudentsData).map((student, index) => ({
          ...student,
          id: (index + 1).toString(),
        }));
        setStudentData(parsedStudentsData);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleStudentClick = (student) => {
    setCurrentSelectedStudentData(student);
    setModalVisible(true);
  };

  return (
    <View style={{ height: 'auto', backgroundColor: 'white' }}>
      {modalVisible && <View style={styles.overlay} />}
      <DataTable style={{ marginBottom: 30, backgroundColor: 'transparent' }}>
        <DataTable.Header style={{ backgroundColor: '#4185f2' }}>
          <DataTable.Title><Text style={styles.tableColumnTitle}>#</Text></DataTable.Title>
          <DataTable.Title><Text style={styles.tableColumnTitle}>Name</Text></DataTable.Title>
          <DataTable.Title><Text style={styles.tableColumnTitle}>Course</Text></DataTable.Title>
          <DataTable.Title><Text style={styles.tableColumnTitle}>Username</Text></DataTable.Title>
        </DataTable.Header>

        <ScrollView>
          {studentData.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleStudentClick(item)}>
              <DataTable.Row style={styles.tableRowBorder}>
                <DataTable.Cell>{item.id}</DataTable.Cell>
                <DataTable.Cell>{item.lName+', '}{item.fName}</DataTable.Cell>
                <DataTable.Cell>{item.course}</DataTable.Cell>
                <DataTable.Cell>{item.username}</DataTable.Cell>
              </DataTable.Row>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Student Information</Text>
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.modalData}>{`First Name: ${currentSelectedStudentData?.fName}`}</Text>
                <Text style={styles.modalData}>{`Last Name: ${currentSelectedStudentData?.lName}`}</Text>
                <Text style={styles.modalData}>{`Course: ${currentSelectedStudentData?.course}`}</Text>
              </View>
              <View>
                <Text style={styles.modalData}>{`Username: ${currentSelectedStudentData?.username}`}</Text>
                <Text style={styles.modalData}>{`Password: ${currentSelectedStudentData?.password}`}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <View style={styles.closeButtonContainer}>
                  <Text style={styles.closeButton}>CLOSE</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  tableRowBorder: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  tableColumnTitle: {
    textAlign: 'center',
    fontSize: 15,
    justifyContent: 'center',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 35,
  },
  modalData: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '10',
  },
  closeButtonContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  closeButton: {
    textAlign: 'center',
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default StudentsData;
