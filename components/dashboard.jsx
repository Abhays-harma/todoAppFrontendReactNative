import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, Modal, Pressable, Keyboard, Alert, TouchableOpacity} from 'react-native';
import * as SQLite from 'expo-sqlite';
import Svg, { Path } from 'react-native-svg';

const db = SQLite.openDatabaseSync('todoApp.db');

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
          CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, group_id INTEGER, title TEXT, description TEXT, completed BOOLEAN);
        `);
        loadGroups();
      } catch (error) {
        Alert.alert('Database Error', 'Failed to initialize database: ' + error.message);
      }
    };

    initializeDatabase();
  }, []);
  const loadGroups = async () => {
    try {
      const groupsData = await db.getAllAsync('SELECT * FROM groups;');
      const enrichedGroups = groupsData.map(group => ({ ...group, tasks: [] }));
      setGroups(enrichedGroups);
      enrichedGroups.forEach(group => {
        loadTasksForGroup(group.id);
      });
    } catch (error) {
      Alert.alert('Database Error', 'Failed to load groups: ' + error.message);
    }
  };

  const loadTasksForGroup = async (groupId) => {
    try {
      const tasks = await db.getAllAsync('SELECT * FROM tasks WHERE group_id = ?;', [groupId]);
      setGroups(prevGroups => prevGroups.map(group =>
        group.id === groupId ? { ...group, tasks } : group
      ));
    } catch (error) {
      Alert.alert('Database Error', 'Failed to load tasks for the group: ' + error.message);
    }
  };
  const handleAddGroup = async () => {
    if (groupName.trim()) {
      try {
        const result = await db.runAsync('INSERT INTO groups (name) VALUES (?);', [groupName]);
        const newGroup = { id: result.lastInsertRowId, name: groupName, tasks: [] };
        setGroups([...groups, newGroup]);
        setGroupName('');
        Keyboard.dismiss();
      } catch (error) {
        Alert.alert('Database Error', 'Failed to add group: ' + error.message);
      }
    } else {
      Alert.alert('Error', 'Group name cannot be empty.');
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      await db.runAsync('DELETE FROM groups WHERE id = ?;', [groupId]);
      await db.runAsync('DELETE FROM tasks WHERE group_id = ?;', [groupId]);
      loadGroups();
    } catch (error) {
      Alert.alert('Database Error', 'Failed to delete group: ' + error.message);
    }
  };


  const handleAddTask = async () => {
    if (taskTitle.trim()) {
      try {
        const result = await db.runAsync('INSERT INTO tasks (group_id, title, description, completed) VALUES (?, ?, ?, ?);',
          [selectedGroup.id, taskTitle, taskDescription, false]
        );
        const newTask = { id: result.lastInsertRowId, title: taskTitle, description: taskDescription, completed: false };
        setGroups(prevGroups => prevGroups.map(group =>
          group.id === selectedGroup.id ? { ...group, tasks: [...group.tasks, newTask] } : group
        ));

        setTaskTitle('');
        setTaskDescription('');
        setIsModalVisible(false);
      } catch (error) {
        Alert.alert('Database Error', 'Failed to add task: ' + error.message);
      }
    } else {
      Alert.alert('Error', 'Task title cannot be empty.');
    }
  };


  const handleEditTask = async () => {
    if (taskTitle.trim()) {
      try {
        await db.runAsync('UPDATE tasks SET title = ?, description = ? WHERE id = ?;', [taskTitle, taskDescription, selectedTask.id]);
        loadTasksForGroup(selectedGroup.id);
        setTaskTitle('');
        setTaskDescription('');
        setIsEditModalVisible(false);
      } catch (error) {
        Alert.alert('Database Error', 'Failed to edit task: ' + error.message);
      }
    } else {
      Alert.alert('Error', 'Task title cannot be empty.');
    }
  };

  const toggleTaskStatus = async (group, taskId) => {
    try {
      const task = group.tasks.find(t => t.id === taskId);
      const newStatus = !task.completed;
      await db.runAsync('UPDATE tasks SET completed = ? WHERE id = ?;', [newStatus, taskId]);
      loadTasksForGroup(group.id);
    } catch (error) {
      Alert.alert('Database Error', 'Failed to toggle task status: ' + error.message);
    }
  };

  const deleteTask = async (group, taskId) => {
    try {
      await db.runAsync('DELETE FROM tasks WHERE id = ?;', [taskId]);
      loadTasksForGroup(group.id);
    } catch (error) {
      Alert.alert('Database Error', 'Failed to delete task: ' + error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 bg-white p-2 mt-5 rounded-lg border border-gray-300 mr-2"
          placeholder="Enter group name"
          value={groupName}
          onChangeText={(text) => setGroupName(text)}
        />
        <Pressable className="bg-blue-500 p-2 mt-5 rounded-lg justify-center items-center" onPress={handleAddGroup}>
          <Text className="text-white font-bold">Add Group</Text>
        </Pressable>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-4 bg-white p-4 rounded-lg border border-gray-300">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold">{item.name}</Text>
              <Pressable className="bg-rose-500 p-2 flex-row justify-center items-center rounded-lg" onPress={() => deleteGroup(item.id)}>
                <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <Path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z" />
                </Svg>
                <Text className="text-white font-bold">Delete</Text>
              </Pressable>
            </View>

            <FlatList
              data={item.tasks}
              keyExtractor={(task) => task.id.toString()}
              renderItem={({ item: task }) => (
                <TouchableOpacity
                  className={`${task.completed ? 'bg-green-100' : 'bg-gray-200'} p-3 rounded-lg my-1`}
                  onPress={() => toggleTaskStatus(item, task.id)}
                >
                  <Text className={`${task.completed ? 'line-through' : ''} text-lg font-bold`}>{task.title}</Text>
                  <Text className="mt-1 text-gray-600">{task.description}</Text>
                  <View className="flex-row justify-end mt-2">
                    <Pressable
                      className="bg-yellow-500 px-2 py-1 rounded-lg mr-1"
                      onPress={() => {
                        setSelectedTask(task);
                        setTaskTitle(task.title);
                        setTaskDescription(task.description);
                        setIsEditModalVisible(true);
                      }}
                    >
                      <Text className="text-white font-bold">Edit</Text>
                    </Pressable>
                    <Pressable className="bg-rose-500 px-2 py-1 rounded-lg" onPress={() => deleteTask(item, task.id)}>
                      <Text className="text-white font-bold">Delete</Text>
                    </Pressable>
                  </View>
                </TouchableOpacity>
              )}
            />

            <Pressable
              className="bg-green-500 p-2 rounded-lg mt-2"
              onPress={() => {
                setSelectedGroup(item);
                setIsModalVisible(true);
              }}
            >
              <Text className="text-white font-bold text-center">Add Task</Text>
            </Pressable>
          </View>
        )}
      />
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-white opacity-80">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-xl text-center font-bold mb-4">Add Task</Text>
            <TextInput
              className="bg-gray-200 p-2 rounded-lg mb-4"
              placeholder="Task Title"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            <TextInput
              className="bg-gray-200 p-2 rounded-lg mb-4"
              placeholder="Task Description"
              value={taskDescription}
              onChangeText={setTaskDescription}
            />
            <Pressable className="bg-blue-500 p-2 rounded-lg mb-2" onPress={handleAddTask}>
              <Text className="text-white font-bold text-center">Add Task</Text>
            </Pressable>
            <Pressable className="bg-gray-500 p-2 rounded-lg" onPress={() => setIsModalVisible(false)}>
              <Text className="text-white text-center font-bold">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-white opacity-80">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-xl font-bold mb-4">Edit Task</Text>
            <TextInput
              className="bg-gray-200 p-2 rounded-lg mb-4"
              placeholder="Task Title"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            <TextInput
              className="bg-gray-200 p-2 rounded-lg mb-4"
              placeholder="Task Description"
              value={taskDescription}
              onChangeText={setTaskDescription}
            />
            <Pressable className="bg-blue-500 p-2 rounded-lg mb-2" onPress={handleEditTask}>
              <Text className="text-white font-bold">Save Changes</Text>
            </Pressable>
            <Pressable className="bg-gray-500 p-2 rounded-lg" onPress={() => setIsEditModalVisible(false)}>
              <Text className="text-white font-bold">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Dashboard;