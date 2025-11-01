import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

const TransactionDetailScreen = ({ route }) => {
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
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
});

export default TransactionDetailScreen;