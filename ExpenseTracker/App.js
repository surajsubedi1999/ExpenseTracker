import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Stack = createNativeStackNavigator();

function SignInScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (username === 'admin' && password === 'admin') {
      navigation.replace('Dashboard');
    } else {
      Alert.alert('Error', 'Invalid credentials. Use admin/admin');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Expense Tracker</Text>
        <Text style={styles.subtitle}>Sign In to Continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>Use: admin / admin</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

function DashboardScreen({ navigation }) {
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      date: '2024-01-15',
      amount: '150.00',
      description: 'Grocery Shopping',
      location: 'Supermarket',
      type: 'Debit',
      category: 'Shopping',
    },
    {
      id: '2',
      date: '2024-01-14',
      amount: '2000.00',
      description: 'Salary',
      location: 'Company',
      type: 'Credit',
      category: 'Income',
    },
    {
      id: '3',
      date: '2024-01-13',
      amount: '75.50',
      description: 'Dinner with friends',
      location: 'Restaurant',
      type: 'Debit',
      category: 'Food',
    },
  ]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{marginRight: 15}}>
          <Text style={{color: '#007AFF', fontSize: 16, fontWeight: '600'}}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.replace('SignIn')
        },
      ]
    );
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
    >
      <View style={styles.transactionHeader}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={[
          styles.amount,
          item.type === 'Credit' ? styles.credit : styles.debit
        ]}>
          ${item.amount}
        </Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.type}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTransaction', {
            setTransactions: setTransactions
          })}
        >
          <Text style={styles.addButtonText}>+ Add Transaction</Text>
        </TouchableOpacity>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No transactions yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first transaction to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
}

function TransactionDetailScreen({ route }) {
  const { transaction } = route.params;

  const getTypeColor = (type) => {
    switch (type) {
      case 'Credit': return '#4CAF50';
      case 'Debit': return '#FF3B30';
      case 'Refund': return '#FF9500';
      default: return '#007AFF';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text style={[
            styles.amount,
            { color: getTypeColor(transaction.type) }
          ]}>
            ${transaction.amount}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Transaction Type</Text>
          <Text style={[
            styles.value,
            { color: getTypeColor(transaction.type) }
          ]}>
            {transaction.type}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{transaction.category}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{transaction.date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{transaction.location}</Text>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.descriptionText}>
            {transaction.description || 'No description provided'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function AddTransactionScreen({ navigation, route }) {
  const { setTransactions } = route.params;

  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    description: '',
    location: '',
    type: 'Debit',
    category: 'Shopping',
  });

  const [errors, setErrors] = useState({});

  const transactionTypes = ['Credit', 'Debit', 'Refund'];
  const categories = ['Shopping', 'Travel', 'Utility', 'Food', 'Entertainment', 'Income', 'Healthcare', 'Other'];

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      return false;
    }

    return date.toISOString().startsWith(dateString);
  };

  const isFutureDate = (dateString) => {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate > today;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    } else if (!isValidDate(formData.date)) {
      newErrors.date = 'Date must be in YYYY-MM-DD format (e.g., 2024-01-15)';
    } else if (isFutureDate(formData.date)) {
      newErrors.date = 'Date cannot be in the future';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a valid positive number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTransaction = () => {
    if (validateForm()) {
      const newTransaction = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount).toFixed(2),
      };

      setTransactions(prev => [newTransaction, ...prev]);

      Alert.alert(
        'Success',
        'Transaction added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Add New Transaction</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <TextInput
              style={[
                styles.input,
                errors.date && styles.inputError
              ]}
              placeholder="YYYY-MM-DD (e.g., 2024-01-15)"
              value={formData.date}
              onChangeText={(text) => updateFormData('date', text)}
            />
            <TouchableOpacity
              style={styles.helperButton}
              onPress={() => updateFormData('date', getCurrentDate())}
            >
              <Text style={styles.helperButtonText}>Use Today's Date</Text>
            </TouchableOpacity>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <TextInput
              style={[
                styles.input,
                errors.amount && styles.inputError
              ]}
              placeholder="0.00"
              value={formData.amount}
              onChangeText={(text) => updateFormData('amount', text)}
              keyboardType="decimal-pad"
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError
              ]}
              placeholder="Enter transaction description"
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              multiline
              numberOfLines={3}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={[
                styles.input,
                errors.location && styles.inputError
              ]}
              placeholder="Enter location"
              value={formData.location}
              onChangeText={(text) => updateFormData('location', text)}
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.type}
                onValueChange={(value) => updateFormData('type', value)}
                style={styles.picker}
              >
                {transactionTypes.map(type => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => updateFormData('category', value)}
                style={styles.picker}
              >
                {categories.map(category => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddTransaction}
            >
              <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Expense Dashboard' }}
        />
        <Stack.Screen
          name="TransactionDetail"
          component={TransactionDetailScreen}
          options={{ title: 'Transaction Details' }}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{ title: 'Add New Transaction' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    paddingHorizontal: 15,
  },
  transactionItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  credit: {
    color: '#4CAF50',
  },
  debit: {
    color: '#FF3B30',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  category: {
    color: '#666',
    fontSize: 14,
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
  type: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  descriptionSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    lineHeight: 22,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  helperButton: {
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  helperButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});